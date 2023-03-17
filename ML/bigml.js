// https://github.com/bigmlcom/bigml-node/blob/master/docs/index.md
// https://www.dataem.com/bigml
// Don't run the all code all the time - produce a model ONCE and use for predictions from now on
// Look for an asyc version.

import bigml from 'bigml'
import fetch from 'node-fetch'
import {appendFileSync, unlink} from 'fs'
import {config} from '../config.js'

var filename = './data/toppings.csv'
var resource_uri = ''
var BIGML_AUTH = config.BIGML_AUTH
var BIGML_AUTH_STR = '?username=' + BIGML_AUTH.user + ";api_key=" + BIGML_AUTH.api_key

async function write_to_CSV(orders, calback)
{
    unlink(filename, (err => {
        if (err) console.log(err);
        else {
            console.log("\nDeleted file: example_file.txt");
        }
        }))
    for(let order of orders)
    {
        var str = ''
        for(let topping of order.toppings)
        {
            str += topping
            str += ','
        }
        
        str = str.substring(0, str.length -1)
        str += '\n'
        try{
            appendFileSync(filename, str)
        }
        catch(err)
        {
            console.log(err)
        }
    }
    calback()
}

function create_association(calback)
{
    var connection = new bigml.BigML(config.BIGML_AUTH.user,config.BIGML_AUTH.api_key)
    var source = new bigml.Source(connection)
    source.create(filename, function(error, sourceInfo) {
        var dataset = new bigml.Dataset(connection)
        dataset.create(sourceInfo, function(error, datasetInfo) {
            var association = new bigml.Association(connection)
            association.create(datasetInfo, function(error, assosInfo) {
                console.log(assosInfo)
                resource_uri = assosInfo.location + assosInfo.resource.split('/')[1] + BIGML_AUTH_STR
                console.log(resource_uri)
            })
        })
    })
    calback()

}
async function get_associations()
{
    var data = await fetch(resource_uri)
    data = await data.json()
    return data
}

async function retrieve_associations(calback)
{
    var when_got = async function(data) {
        
        console.log(data)
        let items = data.associations.items
        let rules = data.associations.rules
        console.log(data.associations.rules)
        console.log(data.associations.items)
        let ret = []
        for (let rule of rules)
        {
            let lhs = rule.lhs[0]
            let rhs = rule.rhs[0]
            let lhs_item = items[lhs]
            let rhs_item = items[rhs]
            let confidence = rule.confidence
            let support = rule.support[0]
            let data = {
                Antecedent: lhs_item.name,
                Consequent: rhs_item.name,
                Support: support,
                Confidence: confidence
            }
            ret.push(data)
        }
        calback(ret)
    }
    let not_ok = true
    let timed_out = 0
    var query_data = async function() {
        let associations = await get_associations()
        // console.log(associations)
        if(associations.code === 200)
        {
            when_got(associations)
        }
        else
        {
            setTimeout(query_data, 15000)
        }
        timed_out += 1
        if(timed_out === 10)
        {
            return null// couldn't get associations after 2.5 minutes, that's too long

        }
    }
    // try to query the associations every 15 seconds
    setTimeout(query_data,15000)
    
}
// retrieve_associations()

// await create_association(function() {retrieve_associations(console.log)})

// // create_source('./basket.csv')
// var connection = new bigml.BigML('PROJECTTIKTIK','02161ce707e6ed37bea44f43111966f392488311')
// var source = new bigml.Source(connection)
// source.create('./groceries.csv', function(error, sourceInfo) {
//     var dataset = new bigml.Dataset(connection)
//     dataset.create(sourceInfo, function(error, datasetInfo) {
//         var association = new bigml.Association(connection)
//         association.create(datasetInfo, function(error, assosInfo) {
//             console.log(assosInfo)
//         })
//     })
// })

// var connection = new bigml.BigML('PROJECTTIKTIK','02161ce707e6ed37bea44f43111966f392488311')
// var source = new bigml.Source(connection);
// source.create('./iris.csv', function(error, sourceInfo) {
//   if (!error && sourceInfo) {
//     var dataset = new bigml.Dataset(connection);
//     dataset.create(sourceInfo, function(error, datasetInfo) {
//       if (!error && datasetInfo) {
//         var model = new bigml.Model(connection);
//         model.create(datasetInfo, function (error, modelInfo) {
//           if (!error && modelInfo) {
//             var prediction = new bigml.Prediction(connection);
//             prediction.create(modelInfo, {'petal length': 1},function(error, prediction) { console.log(JSON.stringify(prediction));console.log(prediction.code)}); 
//           }
//         });
//       }
//     });
//   }
// });

// var data = await fetch("https://bigml.io/andromeda/association/640e02a4aa656f0a13b76043?username=projecttiktik;api_key=02161ce707e6ed37bea44f43111966f392488311")
// data = await data.json()
// // console.log(JSON.stringify(data, null, 2))
// console.log(data.associations.rules)
// console.log(data.associations.items)

export{retrieve_associations, create_association, write_to_CSV}