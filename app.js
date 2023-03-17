import express from 'express'
import {logger} from './Logger.js'
import { DashboardLogic } from './Model/DashboardLogic.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { SearchLogic } from './Model/SearchLogic.js'
import {AnalizeLogic} from './Model/AnalizeLogic.js'
import {connectKafka} from './KafkaConsumer.js'

connectKafka()
const dashboardlogic = new DashboardLogic()

const searchlogic = new SearchLogic()

const analizelogic = new AnalizeLogic()

const app = express()

// WS support

const server = new createServer(app);
const io = new Server(server);

const port = 3000
app.use(express.static('public'))
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    dashboardlogic.update_params(() => {
        var data = dashboardlogic.get_data()
        data.location = 'Main View Big Data Company'
        res.render('index', {data: data})
    })
    
});

app.get('/analyze', (req, res) => {
    
    var data = {location: 'Association Rules'}
    res.render('analyze' ,{data: data})
})

app.get('/search', (req,res)=> {
    var data = {location: 'Order Details For Date'}
    searchlogic.update_details(() =>
    {
        data.branch_names = searchlogic.branch_names
        res.render('search' ,{data: data})
    })
})

app.get('/smth', (req, res)=> {
    let date = req.query.date
    let branch = req.query.branch
    // finish this
    searchlogic.get_orders(date,branch, (orders) => {
        res.send(JSON.stringify(orders))
    })
})

app.get('/analyzesmth', (req, res) => {
    let start = req.query['start']
    let end = req.query['end']
    let start_date = new Date(Date.parse(start))
    let end_date = new Date(Date.parse(end))
    analizelogic.Get_Association_Rules(start_date, end_date, (data) => {
        res.send(JSON.stringify(data));
    })

})

app.post('/order', (req, res) => {
    
    dashboardlogic.process_order(req.body)
    searchlogic.process_order(req.body)
    analizelogic.process_order(req.body)
    res.send('ok')
    io.emit('update', dashboardlogic.get_data())
})

server.listen(port, function (error) {
    if (error)
        throw error;
    else
        console.log("Server is running");}
    );


io.on("connection", () => {
    console.log('Got web socket connection')
    
});

io.on('update serv', (data)=> {
    console.log('connected update serv')
    io.emit('update', data)
})
// redis support

function recieve_order(order)
{
    order = JSON.parse(order)
    dashboardlogic.process_order(order)
    searchlogic.process_order(order)
    analizelogic.process_order(order)
    io.emit('update', dashboardlogic.get_data())
}

export{recieve_order}

