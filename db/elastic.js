

import {Client} from '@elastic/elasticsearch'
import fetch from 'node-fetch'
import {logger} from '../Logger.js'
import {config} from '../config.js'

const elasticClient = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: config.ELASTIC_CONNECTION_STRING.auth.username,
        password: config.ELASTIC_CONNECTION_STRING.auth.password
    }
})
function make_valid_for_elastic(order) {
    // Invalid index name [Pizza Ba'am_Center_1], must not contain the following characters ['\\','/','*','?','"','<','>','|',' ',',']`,
    // invalid_index_name_exception: Invalid index name [Pizza_Baam_Center_1], must be lowercase
    order.branch_name = order.branch_name.toLowerCase()
    var reg = /(\ )+/g
    return order.branch_name.replace(reg, '_')
}

async function get_orders_from_elastic(start_date, branch_name, pull_amount)
{
    const documents = await elasticClient.search({
        index: branch_name,
        query: {
            match: {
                start_date: start_date
                
            }
        },
        size: pull_amount
    })
    logger.debug('got documents:',)
    logger.debug(documents)
    return documents
}

async function set_order_to_elastic(order)
{
    /**
     * order format, might be also end_date
     * {
            start_date: '2023-03-10 13:19:09.272751',
            toppings: [ 'Olive', 'Corn' ],
            branch_id: '1',
            unique_order_id: '1,69',
            branch_location: 'Center',
            branch_name: "Pizza Ba'am_Center_1",
            status: 'Available_Order_Status.In_Progress'
        } 
     */
    var time = order.start_date.split(' ')[1]
    var exactday = order.start_date.split(' ')[0]
    logger.debug("set order ")
    logger.debug(order)
    await elasticClient.index({
        index: order.branch_name,
        id: order.unique_order_id,
        document: {
            time: time,
            start_date: exactday,
            end_date: order.end_date,
            location: order.branch_location,
            quantity: order.quantity,
            toppings: order.toppings,
            status: order.status
        }
    })
}

async function get_branch_names(calback)
{
    elasticClient.cat.indices().then((res) =>
    {
        var regex = /(^pizza)/g 
        var matches = JSON.stringify(res).split(' ').map((str) => str.match(regex) !== null ? str : null).filter((element) => element !== null)
        calback(matches)
    })
}

async function run () {
    await elasticClient.index({
      index: 'game-of-thrones',
      id: '1',
      document: {
        character: 'Ned Stark',
        quote: 'Winter is coming.'
      }
    })
  
    const document = await elasticClient.get({
      index: 'game-of-thrones',
      id: '1'
    })
  
    console.log(document)
  }
  

async function trash_database()
{
    get_branch_names
    ((indices) => {
        elasticClient.indices.delete({
            index: indices
        })
    })
}
//   run().catch(console.log)
// await trash_database()
export {elasticClient, get_orders_from_elastic, set_order_to_elastic,get_branch_names}





