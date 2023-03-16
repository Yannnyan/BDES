
import {dif} from '../utils.js'

class Order
{
    constructor(data, from)
    {
        if(from === 'redis'){
            this.order_id = data.order_id
            this.toppings = data.toppings // {mushroom: 52, onion: 100,...} how much people ordered by topping
            this.order_duration = data.order_duration
            this.order_date = data.order_date
            this.status = data.status
        }
        else{
            this.order_id = data.unique_order_id;
            this.toppings = Array.isArray(data.toppings) ? data.toppings : [data.toppings];
            this.order_duration = data.end_date !== undefined ? dif(data.end_date, data.start_date).getSeconds() : 0
            this.status = data.status.split('.')[1]
            this.order_date = data.start_date;
        }
        
        
    }

    serialize()
    {
        let data = {
            order_id: this.order_id,
            toppings: this.toppings,
            order_duration: this.order_duration,
            order_date: this.order_date,
            status: this.status
        }
        return data
    }

}



export{Order}

