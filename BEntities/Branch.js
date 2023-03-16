

import { OrderRegister } from "./OrderRegister.js"


class Branch
{
    constructor(data_from_redis)
    {
        /**
        
         *      {branch_name: 'bla bla bla',
         *       branch_location: 'haifa',
         *       branch_orders: [{
         *          date: '22.2.3 16:05',
         *          duration: 50,
         *          status: 'Done',
         *          toppings: ['Tomato', 'Eggplant']}
         *      },...]}
         *      
         * 
         */
        this.branch_name = data_from_redis.branch_name
        this.branch_location = data_from_redis.branch_location

        if(data_from_redis.branch_orders === undefined)
            this.order_register = new OrderRegister()
        else
            this.order_register = new OrderRegister(data_from_redis.branch_orders)

    }
    recieve_order(order)
    {
        this.order_register.recieve_order(order)
    }
    get_avg_duration()
    {
        let sum = this.order_register.orders.reduce((prev, order)=> prev + order.order_duration, 0)
        return sum / this.order_register.orders.length
    }
    get_num_open_orders()
    {
        return this.order_register.orders.reduce((prev, order) => prev + (order.status ==='In_Progress' ? 1 : 0), 0)
    }
    get_num_closed_orders()
    {
        return this.order_register.orders.reduce((prev, cur) => prev + cur.status === 'Done' ? 1 : 0, 0);
    }
    /**
     * returns the order time distribution for this branch
     */
    get_order_time_dist()
    {
        let dist = this.order_register.orders.reduce((time_dist, order) => {
            let hour = '' + new Date(order.order_date).getHours();
            if (time_dist[hour] === undefined)
            {
                time_dist[hour] = 0;
            }
                time_dist[hour] += 1;
            return time_dist
        }, {})
        return dist;
    }
    
    get_total_orders()
    {
        return this.order_register.orders.length
    }

    get_total_toppings()
    {
        let toppings = this.order_register.orders.reduce((prev, order) => {
            for(let topping of order.toppings)
            {
                if(topping === undefined)
                    continue;
                if(prev[topping] === undefined)
                    prev[topping] = 0
                prev[topping] += 1
            }
            return prev
        }, {})
        return toppings 
    }
    serialize()
    {
        let orders_serialized = this.order_register.serialize()
        let data = {
            branch_name: this.branch_name,
            branch_location: this.branch_location,
            branch_orders: this.order_register
        }
        return data
    }
    
}


export{Branch}


