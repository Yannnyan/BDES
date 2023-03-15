import {Branch} from './Branch.js'


class Company{
    
    constructor(data)
    {
        /**
         * {company: {
         *      company_name: 'bla bla',
         *      branches: [
         *      {branch_name: 'bla bla bla',
         *       branch_location: 'haifa',
         *       branch_orders: [{
         *          date: '22.2.3 16:05',
         *          duration: 50,
         *          status: 'Done',
         *          toppings: ['Tomato', 'Eggplant']}
         *      },...]
         * ,...]
         * }}
         * 
         */
        this.branches = []
        this.pipeline = function (order) {
            this.recieve_order(order)(order)(order)
        }
        if(data === undefined){
            this.company_name = 'default'
            return
        }
        this.company_name = data.company.company_name || 'default'
        console.log('company name init: ' + this.company_name)
        for(let branch of data.company.branches)
        {
            this.branches.push(new Branch(branch))
        }
    }
    recieve_order(order)
    {
        // check if we need to create new branch
        if(this.branches.map((branch) => branch.branch_name).includes(order.branch_name))
            this.branches.push(new Branch({
                branch_name: order.branch_name,
                branch_location: order.branch_location}))
        // check which branch needs to recieve the order
        return this.branches.find((branch) => branch.branch_name === order.branch_name).recieve_order
    }

    // hot details are now functions
    /**
     * Recieves the average order duration for all branches
     */
    get_average_order_duration()
    {
        let sum = 0
        let num_branches = this.branches.length
        sum = this.branches.reduce(
            (branch, cur) => cur + branch.get_avg_duration(), 0
            )
        return sum / num_branches
    }
    /**
     * Returns the total amount of open orders
     */
    get_open_orders()
    {
        let open_orders = this.branches.reduce(
            (branch, cur) => cur + branch.order_register.orders.reduce(
                (order, cur_total) => cur_total + (order.status === 'In_Progress' ? 1 : 0), 0
            ), 0
        )
        return open_orders
    }
    /**
     * Returns the total number of orders recieved
     */
    get_total_orders()
    {
        let total = this.branches.reduce(
            (branch, cur) => branch.order_register.orders.length + cur, 0
        )
        return total
    }
    /**
     * Returns the number of branches
     */
    get_number_branches()
    {
        return this.branches.length
    }
    /**
     * Returns the branch names
     */
    get_branch_names()
    {
        return this.branches.map((branch) => branch.branch_name)
    }

    // graph details
    get_avg_duration_by_branch()
    {
        let data = {}
        for(let name of this.get_branch_names())
        {
            data[name] = this.branches.find((branch)=> branch.branch_name === name).get_avg_duration()
        }
        return data
    }

    get_total_toppings()
    {
        let all_toppings = this.branches.reduce((prev_arr, branch) =>{
            prev_arr.push(...branch.order_register.orders.map(
                (order) => order.toppings))
                ; return prev_arr
        } ,[])
        let toppings = {}
        for(let topping of all_toppings)
        {
            if(toppings[topping] === undefined)
            {
                toppings[topping] = 1
                continue
            }
            else{
                toppings[topping] += 1
            }
        }
        return toppings
    }

    serialize()
    {
        let branches_serialized = []
        for(let branch of this.branches)
        {
            branches_serialized.push(branch.serialize())
        }
        data = {
            company: {
                company_name: this.company_name,
                branches: branches_serialized
            }
        }
        return JSON.stringify(data)
    }

}


export{Company}


