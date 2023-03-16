import { redisclient, get_data_from_redis, update_redis } from "../db/redisClient.js"
import { logger } from '../Logger.js'
import {dif} from '../utils.js'
import {Branch} from '../BEntities/Branch.js'
import {Company} from '../BEntities/Company.js'
import { OrderRegister } from "../BEntities/OrderRegister.js"

class DashboardLogic{
    constructor()
    {
        // Domain Objects
        this.company = new Company()
        this.time = 0
        this.recieved_before_update = []
        this.is_updated = false
    }
    /**
     * This function is supposed to retrieve the most relevant data from redis and store it in this object,
     * then call calback
     * @param {calback to call after we updated all the parameters} calback 
     */
    update_params(calback)
    {
        get_data_from_redis((data) => {
            this.is_updated = true
            // process orders that were recieved before update
            this.company = new Company(data)
            this.time = new Date(Date.parse(data.time))
            this.process_early_orders()
            calback()
        })
    }
    
    process_early_orders()
    {
        while(this.recieved_before_update.length > 0)
        {
            this.process_order(this.recieved_before_update.pop())
        }
    }

    get_avg_duration_per_branch()
    {
        let avg_duration_per_region = this.company.get_avg_duration_by_branch()
        
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
        let toppings = this.company.get_total_toppings()
        console.log(toppings)
        if(Object.keys(toppings).length > 0)
            for(let key in toppings)
            {
                var val = {
                    "X_Axis": key,
                    "Y_Axis": toppings[key]   
                }
                topping_formatted.push(val)
            }
        return topping_formatted;
    }
    get_time_order()
    {
        var time_formatted = []
        let dist = this.company.get_time_dist_by_hours()
        for(let key in dist)
        {
            var val = {
                "X_Axis": key,
                "Y_Axis": +dist[key]
            }
            time_formatted.push(val)
        }
        return time_formatted;
    }
    
    get_data()
    {
        var data = 
        {
            avg: this.company.get_average_order_duration(),
            total: this.company.get_total_orders(),
            open_orders: this.company.get_open_orders(),
            branches: this.company.get_number_branches(),
            time: this.time,
            toppings: this.company.get_total_toppings(),
            time_order: this.get_time_order(),
            orders_by_region: this.company.get_orders_by_region(),
            avg_duration_per_region: this.company.get_avg_duration_by_branch()
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
        this.time = new Date()
        this.company.recieve_order(order)
        var data = this.company.serialize()
        data.time = this.time.toString();
        data = JSON.stringify(data)
        logger.info(order)
        logger.info(data)
        update_redis(data);
    }
}


export{DashboardLogic}
