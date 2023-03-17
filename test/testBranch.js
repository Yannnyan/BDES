

import {Branch} from '../BEntities/Branch.js'
import { expect } from 'chai';
import { readFile } from 'fs/promises';
import {dif} from '../utils.js'


const orders = JSON.parse(
    await readFile(
      new URL('../data/orders.json', import.meta.url)
    )
);

var order1 = orders.orders[0]
var order2 = orders.orders[1]

var branch_details = {
    branch_name: 'branchie',
    branch_location: 'Atlantis'
}
describe('Testing Branch Class', function() {
    it('Testing Constructor', function(Done) {
        let branch = new Branch(branch_details)
        expect(branch.branch_name, 'testign branch name').to.equal('branchie')
        expect(branch.branch_location, 'testing branch location').to.equal('Atlantis')
        expect(branch.order_register.orders.length, 'testing order_register').to.equal(0)
        Done()
    })
    it('Testing recieve order', function(Done) {
          var branch = new Branch(branch_details)
          branch.recieve_order(order1)
          expect(branch.order_register.orders.length).to.equal(1)
          branch.recieve_order(order2)
          expect(branch.order_register.orders.length).to.equal(2)
          Done()
    })
    it('Testing total_orders', function(Done) {
        var branch = new Branch(branch_details)
        branch.recieve_order(order1)
        expect(branch.get_total_orders()).to.equal(1)
        branch.recieve_order(order2)
        expect(branch.get_total_orders()).to.equal(2)
        Done()
    })
    it('Testing get total toppings', function(Done) {
        var branch = new Branch(branch_details)
        branch.recieve_order(order1)
        branch.recieve_order(order2)
        var data = {
            Eggplant: 2,
            Tomato: 2,
            Mushroom: 2,
            Olive: 2
        }
        expect(branch.get_total_toppings()).deep.equal(data)
        Done()
    })
    it('Testing get avg duration', function(Done) {
        var branch = new Branch(branch_details)
        branch.recieve_order(order1)
        branch.recieve_order(order2)
        let avg_duration = branch.order_register.orders.reduce((prev, order) => prev + order.order_duration,0) / branch.get_total_orders()
        expect(branch.get_avg_duration()).to.equal(avg_duration)
        Done()
    })
    it('Testing nun_open_orders', function(Done){
        var branch = new Branch(branch_details)
        let order2_clone = JSON.parse(JSON.stringify(order2))
        order2_clone.status = 'Available_Order_Status.In_Progress'
        let order2_clone_closed = JSON.parse(JSON.stringify(order2))
        order2_clone_closed.status = 'Available_Order_Status.Done'
        branch.recieve_order(order1)
        branch.recieve_order(order2_clone)
        expect(branch.get_num_open_orders()).to.equal(1)
        branch.recieve_order(order2_clone_closed)
        expect(branch.get_num_open_orders()).to.equal(0)
        Done()
    })
    it('Testing order_time_dist', function(Done) {
        var branch = new Branch(branch_details)
        let order2_clone = JSON.parse(JSON.stringify(order2))
        order2_clone.start_date = "2023-03-16 11:59:31.913502"
        order2_clone.end_date = "2023-03-16 11:02:26.319891"
        branch.recieve_order(order2_clone)
        branch.recieve_order(order1)
        let dist = {
            "11": 1,
            "9": 1
        }
        expect(branch.get_order_time_dist()).deep.equal(dist)
        Done()
    })
})




















