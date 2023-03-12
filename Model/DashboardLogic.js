import { redisclient, get_data_from_redis, update_redis } from "./redisClient.js"
import { logger } from './Logger.js'
import {dif} from './utils.js'

class DashboardLogic{
    constructor()
    {
        // hot details
        this.time = 0
        this.avg = 0
        this.branches = 0
        this.open = 0
        this.total = 0
        // middle details
        this.open_orders_ids = {} // open orders
        this.closed_orders_ids = {} //closed orders
        this.branch_names = "" // branches are ids seperated by commas like 0,1 that are active rn
        this.is_updated = false
        this.recieved_before_update = [] // orders that were recieved before the update
        // graph details
        this.toppings = {} // {mushroom: 52, onion: 100,...} how much people ordered by topping
        this.sum_duration_by_branch = {} // average order duration time per branch
        this.open_order_by_region = {} // number of orders per region
        this.closed_order_by_region = {}
        this.time_order = {}
    }
    /**
     * This function is supposed to retrieve the most relevant data from redis and store it in this object,
     * then call calback
     * @param {calback to call after we updated all the parameters} calback 
     */
    update_params(calback)
    {
        get_data_from_redis((data) => {
            // hot details
            this.avg = data.data.avg
            this.branch_names = data.data.branches
            this.open = data.data.open_orders
            this.total = data.data.total
            this.time = data.data.time
            // middle details
            this.open_orders_ids = JSON.parse(data.data.open_orders_ids) || {}
            this.closed_orders_ids = JSON.parse(data.data.closed_orders_ids) || {}
            this.branches = this.branch_names.split(',').length - 1 // get number of branches
            // graph details
            this.toppings = JSON.parse(data.data.toppings) || {};
            this.sum_duration_by_branch = JSON.parse(data.data.sum_duration_by_branch) || {};
            this.open_order_by_region = JSON.parse(data.data.open_order_by_region) || {};
            this.closed_order_by_region = JSON.parse(data.data.closed_order_by_region) || {};
            this.time_order = JSON.parse(data.data.time_order) || {}
            this.is_updated = true
            // process orders that were recieved before update
            this.process_early_orders()
            calback()
        }, {data: {}})
    }
    
    get_orders_by_region()
    {
        var total_orders_by_region = {}
        for(let key in this.closed_order_by_region)
        {
            total_orders_by_region[key] = +this.closed_order_by_region[key] + +this.open_order_by_region[key]
        }
        return total_orders_by_region
    }

    process_early_orders()
    {
        while(this.recieved_before_update.length > 0)
        {
            this.process_order(this.recieved_before_update.pop())
        }
    }

    update_branches(order)
    {
        var branches_arr = this.branch_names.split(',');
        if(!branches_arr.includes(order.branch_id))
        {
            this.branch_names += ("," + order.branch_id);
            this.branches = this.branch_names.split(',').length - 1;
        }
    }
    
    update_status(order)
    {
        if(order.status.endsWith('In_Progress'))
        {
            // check if we didn't get the order already done
            if(this.closed_orders_ids["" + order.unique_order_id] === undefined)
            {
                this.total = +this.total + 1 || 0
                this.open = +this.open + 1 || 0
                this.open_orders_ids["" + order.unique_order_id] = 1
            }
        }
        else if (order.status.endsWith('Done'))
        {
            // check if we got the order
            if(this.open_orders_ids["" + order.unique_order_id] !== undefined)
            {
                this.open = +this.open - 1 || 0
                this.open_order_by_region[order.branch_location] = +this.open_order_by_region[order.branch_location] - 1 || 0
                // remove the order
                this.open_orders_ids["" + order.unique_order_id] = undefined
                this.wait_time_sum += (dif(order.end_date, order.start_date).getTime() / 1000)
            }
            // if we didn't get the order, then just add it to the closed orders
            else if(this.closed_orders_ids["" + order.unique_order_id] === undefined){
                this.closed_orders_ids["" + order.unique_order_id] = 1
                this.total = +this.total + 1 || 0
                this.wait_time_sum += (dif(order.end_date, order.start_date).getTime() / 1000)
            }
        }
    }
    
    update_time_params(order)
    {
        // current time update
        var date = new Date()
        this.time =  date.getDate() + "/"
        + (date.getMonth()+1) + "/"
        + date.getFullYear() + " "+ date.getHours() +":" + date.getMinutes()
        if(order.status.endsWith('Done'))
        {
            // average duration update
            var duration = dif(order.end_date, order.start_date).getTime() / 1000
            var num_closed = (this.total - this.open)
            if(this.sum_duration_by_branch[order.branch_name] === undefined)
            {
                this.sum_duration_by_branch[order.branch_name] = 0;
            }
            this.sum_duration_by_branch[order.branch_name] = +this.sum_duration_by_branch[order.branch_name] + duration
            this.avg = (Object.values(this.sum_duration_by_branch).reduce((prev, cur) => prev + cur, 0) / num_closed)
        }
        if(this.open_orders_ids["" + order.unique_order_id] === undefined && this.closed_orders_ids["" + order.unique_order_id] === undefined)
        {
            var hours = new Date(Date.parse(order.start_date)).getHours()
            if(this.time_order[hours] === undefined)
            {
                this.time_order[hours] = 0;
            }
            this.time_order[hours] = +this.time_order[hours] + 1
        }
    }

    update_toppings(order)
    {
        let toppings = Array.isArray(order.toppings) ? order.toppings : [order.toppings]
        for(let topping of toppings)
        {
            if(this.toppings[topping] === undefined)
            {
                this.toppings[topping] = 0
            }
            this.toppings[topping] = +this.toppings[topping] + 1
        }
    }

    update_regions(order)
    {
        if(this.open_order_by_region[order.branch_location] === undefined)
        {
            this.open_order_by_region[order.branch_location] = 0;
        }
        if(this.closed_order_by_region[order.branch_location]=== undefined)
        {
            this.closed_order_by_region[order.branch_location] = 0;
        }
        if(order.status.endsWith('In_Progress'))
        {
            this.open_order_by_region[order.branch_location] = +this.open_order_by_region[order.branch_location] + 1

        }
        else if(order.status.endsWith('Done'))
        {
            this.closed_order_by_region[order.branch_location] = +this.closed_order_by_region[order.branch_location] + 1
        }
    }

    get_avg_duration_per_region()
    {
        let avg_duration_per_region = {}
        
        for(let key in this.sum_duration_by_branch)
        {
            let branch_id = +key.charAt(key.length - 1)
            let closed_orders_by_branch = Object.keys(this.closed_orders_ids).reduce((prev, cur) => 
            {
                return branch_id === +cur.charAt(0) ? +prev + 1 : +prev
            }, 0)
            avg_duration_per_region[key] = this.sum_duration_by_branch[key] / closed_orders_by_branch
        }
        let formated_duration = []
        for(let key in avg_duration_per_region)
        {
            var data = {
                "X_Axis": key,
                "Y_Axis": (Math.round(avg_duration_per_region[key] * 100) / 100).toFixed(2)
            }
            formated_duration.push(data)
        }
        return formated_duration
    }
    get_toppings()
    {
        var topping_formatted = []
        for(let key in this.toppings)
        {
            var val = {
                "X_Axis": key,
                "Y_Axis": +this.toppings[key]   
            }
            topping_formatted.push(val)
        }
        return topping_formatted;
    }
    get_time_order()
    {
        var time_formatted = []
        for(let key in this.time_order)
        {
            var val = {
                "X_Axis": key,
                "Y_Axis": +this.time_order[key]
            }
            time_formatted.push(val)
        }
        return time_formatted;
    }
    
    get_data()
    {
        var data = 
        {
            avg: this.avg,
            total: this.total,
            open_orders: this.open,
            branches: this.branches,
            time: this.time,
            toppings: this.get_toppings(),
            time_order: this.get_time_order(),
            orders_by_region: this.get_orders_by_region(),
            avg_duration_per_region: this.get_avg_duration_per_region()
        }
        return data
    }

    process_order(order)
    {
        // if we got an order before we updated everything form redis, then push it to an array and when 
        // we update we will pop all the array
        if(this.is_updated === false)
        {
            this.recieved_before_update.push(order)
            return
        }
        /**
         * {
         *     data: {
                    branches: '5',
                    avg: '4',
                    open_orders: '3',
                    total: '2',
                    time: '10/3/2023 11:58'
                }
        * }
                {
                    start_date: '2023-03-10 13:19:09.272751',
                    toppings: [ 'Olive', 'Corn' ],
                    branch_id: '1',
                    unique_order_id: '1,69',
                    branch_location: 'Center',
                    branch_name: "Pizza Ba'am_Center_1",
                    status: 'Available_Order_Status.In_Progress'
                }
        */
        this.update_time_params(order)
        this.update_branches(order)
        this.update_status(order)
        this.update_toppings(order)
        this.update_regions(order)

        var data = {
            // hot details
            branches: this.branch_names,
            avg: this.avg,
            open: this.open,
            total: this.total,
            time: this.time,
            // middle
            open_orders_ids: JSON.stringify(this.open_orders_ids),
            closed_orders_ids: JSON.stringify(this.closed_orders_ids),
            // graph details
            toppings : JSON.stringify(this.toppings),
            sum_duration_by_branch : JSON.stringify(this.sum_duration_by_branch),
            open_order_by_region : JSON.stringify(this.open_order_by_region),
            closed_order_by_region : JSON.stringify(this.closed_order_by_region),
            time_order: JSON.stringify(this.time_order)
        }
        logger.info(order)
        logger.info(data)
        update_redis(data);
    }
}


export{DashboardLogic}
