import redis from 'redis'
import {config} from './config.js'

const redisclient = redis.createClient()
redisclient.connect()
redisclient.on('connect', function(){
    console.log('Redis Client Connected')
});

async function get_data_from_redis(calback, data)
{
    // using promises to get all the data from redis, then calling a callback function with the data recieved,
    // updating the data object with values recieved
    redisclient.hGetAll('important_data')
    .then((important_data) => {
        for(let key in important_data)
        {
            data.data[key] = important_data[key]
        }
        console.log(data)
        calback(data)
    })
}

async function update_redis(data)
{
    for(let key in data)
    {
        redisclient.hSet('important_data', key ,data[key])
    }
}

async function reset_redis()
{
    let data = {
        open_orders: 0,
        closed_order_by_region: "{}",
        branches: "",
        open_order_by_region: "{}",
        open: 0,
        open_orders_ids: '{}',
        sum_duration_by_branch: '{}',
        closed_orders_ids:'{}',
        total: 0,
        avg: 0,
        toppings: '{}',
        time_order: '{}'
    }
    update_redis(data)
}
// await reset_redis()
export {redisclient, get_data_from_redis, update_redis}
