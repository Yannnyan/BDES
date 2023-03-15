

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
        console.log('branch init: ' + this.branch_name + " " + this.branch_location)
        if(data_from_redis.branch_orders === undefined)
            this.order_register = new OrderRegister()
        this.order_register = new OrderRegister(data_from_redis.branch_orders)

    }
    get_avg_duration()
    {
        let sum = this.order_register.orders.reduce((order, cur)=> cur + order.order_duration, 0)
        return sum / this.order_register.orders.length
    }
    recieve_order(order)
    {

        return this.order_register.recieve_order
    }

    serialize()
    {
        orders_serialized = this.order_register.serialize()
        let data = {
            branch_name: this.branch_name,
            branch_location: this.branch_location,
            branch_orders: this.order_register
        }
        return data
    }
    
}


export{Branch}


