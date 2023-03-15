


class Order
{
    constructor(redis_data)
    {
        this.order_id = redis_data.order_id
        this.toppings = redis_data.toppings // {mushroom: 52, onion: 100,...} how much people ordered by topping
        this.order_duration = redis_data.order_duration
        this.order_date = redis_data.order_date
        this.status = redis_data.status
        console.log(redis_data)
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

