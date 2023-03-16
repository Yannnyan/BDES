// const Company = require('../BEntities/Company.js').Company;

import {Company} from '../BEntities/Company.js'
import {dif} from '../utils.js'
import { expect } from 'chai';
import { readFile } from 'fs/promises';


const orders = JSON.parse(
    await readFile(
      new URL('../data/orders.json', import.meta.url)
    )
);

var order1 = orders.orders[0]
var order2 = orders.orders[1]

describe('Testing Company Class', function() {
    it('1. Testing constructor', function(Done) {
        let company = new Company()
        expect(company.company_name, 'company name').to.equal('default')
        Done()
    })
    it('2. Testing Recieve Order', function(Done) {
        var order1 = {
            start_date: '2023-03-16 09:59:31.913502',
            end_date: '2023-03-16 10:00:26.319891',
            toppings: [ 'Eggplant', 'Tomato', 'Mushroom', 'Olive' ],
            branch_id: '2',
            unique_order_id: '2,48',
            branch_location: 'center',
            branch_name: 'pizza_baam_center_2',
            status: 'Available_Order_Status.Done'
          }
          let company = new Company()
          company.recieve_order(order1)
          expect(company.branches.length, 'branches length').to.equal(1)
          Done()
    })
    
    it('3. Testing get_average_order_duration', function(Done) {
        var company = new Company()
        company.recieve_order(order1)
        company.recieve_order(order2)
        let duration = (dif(order1.end_date, order1.start_date).getSeconds() +  dif(order2.end_date, order2.start_date).getSeconds()) / 2
        expect(company.get_average_order_duration(), 'order1 + order2 / 2').to.equal(duration)
        Done()
    })
    it('4. Testing get_open_orders', function(Done) {
        var company = new Company()
        var order1_clone = JSON.parse(JSON.stringify(order1))
        var order2_clone = JSON.parse(JSON.stringify(order2))
        order1_clone.status = 'Available_Order_Status.In_Progress'
        order2_clone.status = 'Available_Order_Status.In_Progress'
        company.recieve_order(order1_clone)
        company.recieve_order(order2_clone)
        expect(company.get_open_orders(), 'open total order1, order2').to.equal(2)
        Done();
    })
    it('5. Testing get_total_orders', function(Done) {
        var company = new Company()
        
        company.recieve_order(order1)
        company.recieve_order(order2)

        expect(company.get_total_orders(), 'get total orders order1, order2').to.equal(2)
        Done()
    })
    it('6. Testing get_number_branches', function(Done) {
        var company = new Company()
        let order2_clone = JSON.parse(JSON.stringify(order2))
        order2_clone.branch_name = 'pizza_baam_center_1'
        company.recieve_order(order1)
        company.recieve_order(order2_clone)
        expect(company.get_number_branches(), 'get num branches with two branches').to.equal(2)
        Done()
    })
    it('7. Testing get_branch_names', function(Done) {
        var company = new Company()
        company.recieve_order(order1)
        let order2_clone = JSON.parse(JSON.stringify(order2))
        order2_clone.branch_name = 'pizza_baam_south_2'
        company.recieve_order(order2_clone)
        expect(company.get_branch_names(), 'get_branch_names').deep.equal(['pizza_baam_center_2','pizza_baam_south_2'])
        Done()
    })
    it('8. Testing get_branch_regions', function(Done) {
        var company = new Company()
        let order2_clone = JSON.parse(JSON.stringify(order2))
        order2_clone.branch_location = 'south'
        order2_clone.branch_name = 'pizza_baam_south_2'
        company.recieve_order(order1)
        company.recieve_order(order2_clone)
        expect(company.get_branch_regions(), 'get_branch_regions 2 branches south, center').deep.equal(['center', 'south'])
        Done()
    })

    it('9. Testing get_avg_duration_by_branch', function(Done) {
        var company = new Company()
        company.recieve_order(order1)
        company.recieve_order(order2)
        var dist = {}
        dist[order1.branch_name] = company.branches[0].get_avg_duration()
        expect(company.get_avg_duration_by_branch()).deep.equal(dist)
        Done()
    })
    
})














