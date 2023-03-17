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
        if(data === undefined || data.company === undefined){
            this.company_name = 'default'
            return
        }
        let date = new Date()
        this.company_name = data.company.company_name || 'default'
        for(let branch of data.company.branches)
        {
            this.branches.push(new Branch(branch))
        }
        // remove branches that are irrelevant to today
        this.branches = this.branches.filter((branch) => !branch.get_total_orders() === 0 ||
                            branch.order_register.orders.find((order) => new Date(order.order_date).getDay() === date.getDay()))

    }
    recieve_order(order)
    {

        // check if we need to create new branch
        var branch;
        if(!this.branches.map((branch) => branch.branch_name).includes(order.branch_name))
        {
            branch = new Branch({
            branch_name: order.branch_name,
            branch_location: order.branch_location})
            this.branches.push(branch)
        }
        // check which branch needs to recieve the order
        this.branches.find(branch => branch.branch_name === order.branch_name).recieve_order(order)

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
            (prev, branch) => prev + branch.get_avg_duration() || 0, 0
            )
        return sum / num_branches
    }
    /**
     * Returns the total amount of open orders
     */
    get_open_orders()
    {
        let open_orders = this.branches.reduce(
            (prev, branch) => prev + branch.get_num_open_orders() || 0, 0
        )
        return open_orders
    }
    /**
     * Returns the total number of orders recieved
     */
    get_total_orders()
    {
        let total = this.branches.reduce(
            (prev, branch) => (branch.get_total_orders() || 0) + prev , 0
        )
        return total
    }
    /**
     * Returns the number of branches
     */
    get_number_branches()
    {
        return this.branches.length || 0
    }
    /**
     * Returns the branch names
     */
    get_branch_names()
    {
        return this.branches.map((branch) => branch.branch_name)
    }
    get_branch_regions()
    {
        var regions_with_copies = this.branches.map((branch) => branch.branch_location)
        return Array.from(new Set(regions_with_copies))
    }
    // graph details
    get_avg_duration_by_branch()
    {
        let data = {}
        for(let name of this.get_branch_names())
        {
            data[name] = this.branches.find((branch)=> branch.branch_name === name).get_avg_duration() || 0
        }
        return data
    }
    get_avg_duration_by_region()
    {
        let data = {}
        for(let region of this.get_branch_regions())
        {
            data[region] = this.branches.filter((branch, index) => {
                return branch.branch_location === region
            }).reduce((prev, branch) => prev + branch.get_avg_duration(), 0)
        }
        return data
    }

    get_orders_by_branch()
    {
        let data = {}
        for(let branch of this.branches)
        {
            data[branch.branch_name] = this.branches.find((b) => b.branch_name === branch.branch_name).get_total_orders()
        }
        return data;
    }
    get_orders_by_region()
    {
        let data = {}
        for(let region of this.get_branch_regions())
        {
            data[region] = this.branches.filter((branch, index) => branch.branch_location === region)
                            .reduce((prev, branch) => prev + branch.get_total_orders(), 0)
        }
        return data;
    }
    get_total_toppings()
    {
        
        let toppings = this.branches.reduce((prev, branch) => {
            let branch_toppings = branch.get_total_toppings()
            for(let topping in branch_toppings)
            {
                if(prev[topping] === undefined)
                    prev[topping] = 0
                prev[topping] += branch_toppings[topping] 
            }
            return prev
        }, {})
        return toppings
    }

    get_time_dist()
    {
        var dist = {}
        for(let branch of this.branches)
        {
            var branch_dist = branch.get_order_time_dist()
            for(let key in branch_dist)
            {
                if(dist[key] === undefined)
                {
                    dist[key] = 0
                }
                dist[key] += branch_dist[key]
            }
        }
        return dist
    }

    serialize()
    {
        let branches_serialized = []
        for(let branch of this.branches)
        {
            branches_serialized.push(branch.serialize())
        }
        let data = {
            company: {
                company_name: this.company_name,
                branches: branches_serialized
            }
        }
        return data
    }

}


export{Company}


