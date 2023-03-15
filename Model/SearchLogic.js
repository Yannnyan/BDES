import {get_orders_from_elastic, set_order_to_elastic, get_branch_names} from '../db/elastic.js'
import {dif} from '../utils.js'

class SearchLogic{
    constructor()
    {
        this.DEFAULT_PULL_AMOUNT = 10
        this.date = undefined
        this.branch = undefined
        this.branch_names = []
        this.pull_amount = 10
    }
    update_details(calback) {
        get_branch_names((matches) => {
            this.branch_names = matches
            calback()
        })
    }
    process_order(order) {
        if(order.status.endsWith('In_Progress')) // filter in progress orders we dont need them in elastic
            return
        set_order_to_elastic(order)
    }

    format_orders(orders)
    {
        console.log(orders)
        return orders.map((order) => {
            var toppings = typeof Array.isArray(order._source.toppings) ? order._source.toppings : [order._source.toppings]
            var duration = dif(order._source.end_date, (order._source.start_date+ " " + order._source.time)).getTime() / 1000
            toppings = toppings ? toppings : []
            var o = {
                'Time': order._source.time.split('.')[0],
                'Make_Duration': duration,
                'Quantity': 1,
                'Mushroom': toppings.includes('Mushroom') ? 1 : 0,
                'Olive': toppings.includes('Olive') ? 1 : 0,
                'Onion': toppings.includes('Onion') ? 1 : 0,
                'Corn': toppings.includes('Corn') ? 1 : 0,
                'Eggplant': toppings.includes('Eggplant') ? 1 : 0,
                'Tomato': toppings.includes('Tomato') ? 1 : 0,
                'Status': order._source.status.split('.')[1]
            }
            return o;
        })
    }

    increase_pull_amount()
    {
        this.pull_amount += 10
    }
    get_orders(date, branch_name, calback)
    {
        if(branch_name == this.branch)
        {
            this.increase_pull_amount()
        }
        else{
            this.pull_amount = this.DEFAULT_PULL_AMOUNT
        }
        this.branch = branch_name
        get_orders_from_elastic(date,branch_name, this.pull_amount)
        .then((documents) => {
            calback(this.format_orders(documents.hits.hits))
        })
    }



}


export {SearchLogic}


