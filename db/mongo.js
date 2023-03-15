import mongoose from 'mongoose'
import {logger} from '../Logger.js'
import {Format_Order_Mongo} from '../utils.js'
import {config} from '../config.js'
var url = config.MONGO_CONNECTION_STRING

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Mongoose Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error Mongoose connecting to the database. n${err}`);
    })

let pizzaorder_scheme = new mongoose.Schema({
    start_date : {
        type: Date,
        required: true,
        unique: false
    },
    end_date : {
        type: Date,
        required: true,
        unique: false
    },
    toppings: {
        type: Array,
        required: true,
        unique: false
    },
    branch_id: {
        type: Number,
        required: true,
        unique: false

    },
    unique_order_id: {
        type: String,
        required: true,
        unique: true
    },
    branch_location: {
        type: String,
        required: true,
        unique: false
    },
    branch_name: {
        type: String,
        required: true,
        unique: false
    },
    status: {
        type: String,
        require: true,
        unique: false
    }

})
// var analizeLogic = new AnalizeLogic()
let Pizza_Model = mongoose.model('PizzaOrder', pizzaorder_scheme)
// let order = {
//     start_date: '2023-03-10 23:28:20.102205',
//     end_date: '2023-03-10 23:28:26.112654',
//     toppings: [ 'Eggplant', 'Tomato', 'Corn' ],
//     branch_id: '1',
//     unique_order_id: '1,96',
//     branch_location: 'Dan',
//     branch_name: "Pizza Ba'am_Dan_1",
//     status: 'Available_Order_Status.Done'
    
// }
// let pizza_model = new Pizza_Model(analizeLogic.Format_Order_Mongo(order))
// pizza_model.save()
// .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

async function Save_Order(order)
{
    let pizza_model = new Pizza_Model(Format_Order_Mongo(order))
    await pizza_model.save()
    .then((doc) => {
            logger.log('info',doc);
          })
          .catch((err) => {
            logger.error(err);
          });
}

async function Get_Orders(start_date, end_date)
{
    var documents = await Pizza_Model.find({start_date: { $gte: start_date, $lt: end_date } })
    logger.log('info','retrieved data')
    logger.log('info',documents)
    return documents;
}

// Get_Orders()

export{Pizza_Model, Save_Order, Get_Orders}
