
import {Order} from './Order.js'

class OrderRegister
{
    constructor(data_from_redis)
    {
        /**
         * [{
         *          date: '22.2.3 16:05',
         *          duration: 50,
         *          status: 'Done',
         *          toppings: ['Tomato', 'Eggplant']}
         *      },...]
         */
        // this.order_duration = {} // order id to order duration
        // this.open_orders_ids = {} // open orders
        // this.closed_orders_ids = {} //closed orders
        // this.order_time = {}
        this.orders = []
        if(data_from_redis === undefined)
            return
        if(Array.isArray(data_from_redis.orders))
            for(let order of data_from_redis.orders)
            {
                this.orders.push(new Order(order, 'redis'))
            }
    }

    recieve_order(order)
    {
        this.orders.push(new Order(
            order
        , 'customer'))
    }
    
    serialize()
    {
        let serialized_orders = []
        for(let order of this.orders)
        {
            serialized_orders.push(order.serialize())
        }
        return serialized_orders
    }
}


export{OrderRegister}




