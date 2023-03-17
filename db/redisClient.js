import redis from 'redis'
import {config} from '../config.js'

const redisclient = redis.createClient()
redisclient.connect()
redisclient.on('connect', function(){
    console.log('Redis Client Connected')
});

async function get_data_from_redis(calback)
{
    // using promises to get all the data from redis, then calling a callback function with the data recieved,
    // updating the data object with values recieved
    redisclient.get('data')
    .then((res) => {
        calback(JSON.parse(res))
    })
}

async function update_redis(data)
{
    redisclient.set('data', data)
}

async function reset_redis()
{
    let data = 
        {company: {
            company_name: 'bla bla',
            branches: [
            {branch_name: 'bla bla bla',
            branch_location: 'haifa',
            branch_orders: [{
                date: '2023-03-10 13:19:09.272751',
                duration: 50,
                status: 'Done',
                toppings: ['Tomato', 'Eggplant']}]}]
            }}
    update_redis(JSON.stringify(data))
}
async function get_data()
{
    get_data_from_redis(() => {})
}
// await reset_redis()
// await get_data()
export {redisclient, get_data_from_redis, update_redis}
