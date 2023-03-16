
import {Order} from '../BEntities/Order.js'
import { expect } from 'chai';
import { readFile } from 'fs/promises';
import {dif} from '../utils.js'

// read orders
const orders = JSON.parse(
    await readFile(
      new URL('../data/orders.json', import.meta.url)
    )
);
var order1 = orders.orders[0]
var order2 = orders.orders[1]
var order_redis = orders.orders_redis[0]
describe('Testing Order Class', function() {
    it('Testing Constructor', function(Done){
        var order = new Order(order1, 'customer')
        expect(order.order_date, 'Testing order date').to.equal("2023-03-16 09:59:31.913502")
        expect(order.order_id, 'Testing order id').to.equal("2,48")
        expect(order.order_duration, 'Testing order duration').to.equal(dif("2023-03-16 10:00:26.319891","2023-03-16 09:59:31.913502").getSeconds())
        expect(order.status, 'Testing order status').to.equal('Done')
        let arr = [ "Eggplant", "Tomato", "Mushroom", "Olive" ]
        expect(order.toppings, 'Testing order toppings').deep.to.equal(arr)
        Done()
    })
    it('Testing Constructor Redis', function(Done) {
        var order = new Order(order_redis, 'redis')
        expect(order.order_date, 'Testing order date').to.equal("2023-03-16 09:59:31.913502")
        expect(order.order_id, 'Testing order id').to.equal("1,2")
        expect(order.order_duration, 'Testing order duration').to.equal(50)
        expect(order.status, 'Testing order status').to.equal('Done')
        let arr = [ "Olive","Mushroom" ]
        expect(order.toppings, 'Testing order toppings').deep.to.equal(arr)
        Done()
    })
})














