# BDES
Big Data Enterprise System </br>
# Technologies used
![image](https://user-images.githubusercontent.com/82415308/225888317-1fa13b99-fb95-4a34-be04-ac7721f79713.png)
![image](https://user-images.githubusercontent.com/82415308/225888083-e7386fe9-6a4a-4866-864b-6dbeebfaf75c.png)
![image](https://user-images.githubusercontent.com/82415308/225888250-dbcf455b-3ac6-429e-bc4d-3339ce6bba19.png)
![image](https://user-images.githubusercontent.com/82415308/225611279-bc910309-cb89-490a-a103-91442a7dfe4c.png)
![image](https://user-images.githubusercontent.com/82415308/225889198-ba6b0668-4fe0-4b43-b18c-21ba4430642d.png)
![image](https://user-images.githubusercontent.com/82415308/225889055-8952235b-07b5-414e-a5e3-6e830278f341.png)
![image](https://user-images.githubusercontent.com/82415308/225889479-d18efb28-5a88-4b10-ae47-181c80ee0e8a.png)
![image](https://user-images.githubusercontent.com/82415308/225889592-6ac0f5fc-71c4-4c00-9515-ab2eee3f6476.png)
![image](https://user-images.githubusercontent.com/82415308/225889646-e7a84d83-f862-4f86-af16-21cd2b259bf8.png)
![image](https://user-images.githubusercontent.com/82415308/225889716-723d5773-5010-4a14-8885-ab45b3be8e7c.png)
# Project Overview
![image](https://user-images.githubusercontent.com/82415308/226089818-a7f2d28a-4a69-481d-b1d2-c732ccaa71f4.png)

# Big Data Pizza Information system 🍕
1) This project represents a Big Data information system to manage orders in real time of a company, say a pizza company, which has several branches that deliver order information to the system. 
2) The Orders are delivered by a Pizza company simulator, which runs on python then for each order information ready to deliver send http message to a small nodejs which is connected to kafka and it's purpose is to store the orders untill kafka is ready to deliver them, and then deliver them using kafka producer. 
* Note - In this project kafka brokers are not running localy, instead I used Cloud service CloudKarafka.
3) Then the orders are recieved by the main express server which stores the orders in several databases, ie. Elasticsearch, Mongodb, Redis. Each database has a purpose yet we used several databases instead of one, only to practice use of these. 
* Note - Elasticsearch and Redis are running on two docker images. and Im using cloud service to communicate with mongodb called Atlas with ODM (Object Document Mapper) Mongoose.
4) Redis has a purpose to store only hot details according to lambda architecture, which has a cold channel and a hot channel. Then we use those details to aggregate and present to a manager of the company or whichever stock holders, details about branches processing times and company spendings.
5) Elasticsearch is purposed to store all the orders and to pull out orders in a certain date using method to pull only the top most relevent orders first and if the user requires more then we pull more.
6) Mongodb is purposed to store all orders and is used to train a machine learning association model to see the relationships between the most popular toppings of pizza users requested in thier orders.
* Note Bigml Cloud Service is used to train such a model.
* Note - Mongodb and Elasticsearch are both in the Cold Channel, yet Redis is in the Hot Channel.
7) Dashboard is created from Redis's data and is created using D3JS library which is popular for creating 2d charts. The Dashboard is constantly being updated using WebSockets Protocol, whenever a new order is consumed by the kafka consumer, a function is called to update the databases, and then update the dashboard using websockets to tell the users to update thier data.
8) Unit testing were done using Mocha Chai testing library for nodejs and express.
# Object Oriented Design, And Bussiness Entities
Entities such as a Company, Branch, Order Register, Order are used to create an elegant solution to processing data in layers, and introduce easy maintainability with seperation of concerns principle that for each entity there is a seperate purpose or role.
* Note that the design of these entities is top to bottom, and linear. That means, the functions used by company entity use only branch functions, and branch functions use only order register functions. Which makes it easy to refactor, and change code. </br>
- The Company entity holds the most high level role, which is to manage relevant branches(i.e to filter closed branches, to aggregate data from branches).
The Branch entity is used to aggregate data from the order register.
The Order Register entity is used to manage orders (i.e recieve only relevant orders, hold the orders and register new order in the system.)
The Order entity holds the details about an order.
The Dashboard logic and formulating is done in the DashboardLogic Class, The same goes for the AnalyzeLogic, and the SearchLogic.
# Kafka (cloud Karakafka service)
For this project I created a topic in cloud karafka, then i used rdkafka library in nodejs to build a consumer side and a producer side. The consumer is the main server, and the producer is the pizza company simulator. i used [this](https://github.com/CloudKarafka/nodejs-kafka-example/blob/main/consumer.js) sample code for the consumer, and this [this](https://github.com/CloudKarafka/nodejs-kafka-example/blob/main/producer.js) for the producer. To use this in my application I had to create a seperate config file, such that people can't see my configurations and spam my server. note that in the config I had to change medata.broker.list to the information in cloudkarafka, and aswell username and password ofcourse. also, I had to create a topic in cloud karafka and use the topic's name in the code.
* Things I found out while working with kafka:
1) Kafka is designed to recieve a lot of data, big enough such that nodejs can't handle them I got error that nodejs had memory leaks due to using the kafka consumer the wrong way, instead i used the kafka consumer to send http messages to the server which is wrong. So I fixed it running the kafka consumer asyncroniously from the server code.
2) SetTimeout is unnecessary and kills the consumer after threshold. So I used the kafka consumer and was surprised that it shut down after few minutes.
# Lambda Architecture(Hot channel (redis))
![image](https://user-images.githubusercontent.com/82415308/226089791-806380c1-dc38-4273-9f2f-a6e5544e8c94.png)
## Redis (docker image)
To use redis in my application I downloaded a docker image called 'redis', also note that you can pass redis through docker the enviroment variable 
```js
ALLOW_EMPTY_PASSWORD=yes
```
for no use in password when sending or recieving data. I read that redis stores data in the RAM, and used for caching. Which then connected the dots for me, why im using redis for hot data storage in this application. I found out that redis does not support by default nested json storage, so i decided to store all the data in one key, as a string. Making redis fairly simple using js 
``` js
JSON.stringify()
```
, and 
```js 
JSON.parse()
``` 
functions. I used this kind of formatting for my data, making it easy to deserialize the data into objects, 
```js
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
```
# Nodejs express 
I used Nodejs with express for the main server, and also for the simulator server.
Things I struggled with coding the main server:
* Most tutorials use common javascript, yet it's recommended to use ES type. At first I didn't get why i can't use require in my code. Then I figured that if the module is named with .js then the javascript must be written in ES format, but if the module is named with .cjs then it's written in common javascript format. That's actually very important.
* I Figured how to import Modules written in cjs with es by using the syntax:
```js
import x from 'module_y'
```
* To recieve json/application data with express, I had to tell explicitly for express to use 
```js
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
```
* To set ejs rendering I had to use:
```js
app.set('view engine', 'ejs');
```
# Cold Channel(bigml, mongodb, elasticsearch))
## Mongodb (mongoose ODM, cloud atlas)
To use mongoose, I first had to ccreate a scheme for my data, the scheme looks like that
```js
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
```
* Note that in version 8.15 that i used, old tutorials for mongoose which use callback functions are no longer relevant because new mongoose does not support callback functions. 
* So I figured that i would create async set order and get orders and await for the promise.
## Bigml(cloud)
Bigml is using GET POST PUT DELETE syntax for everything, so i actually used my browser to check some of the stuff i created in the service. 
* Note that the connection parameters like username and password are passed in the URI. docs can be found [here](https://bigml.com/api/authentication)
* I used the help code and bigml library for js, can be found [here](https://github.com/bigmlcom/bigml-node#:~:text=var%20bigml%20%3D-,require,-(%27bigml%27))
* I struggled quite a bit with bigml, one main issue i had is that i can't exactly know when my model was created. And my real time application needs to know when it's finished. so to solve this issue I queried bigml every 15 seconds to check if it's ready or not.using setTimeout with async function calback, to await for promises in async outer function so my code will not run too early. 
```js
async function retrieve_associations(calback)
{
    setTimeout(async function() {
        var data = await fetch(resource_uri)
        data = await data.json()
        ...
        ,15000)
```
* bigml with node supports csv file formatting and other formats that were not familiar to me, so everytime I had to write all my data to csv file before creating associations.
## Elasticsearch(docker image)
Elasticsearch takes a lot of ram for no reason actually when running it's docker image, to override the max ram capacity I used this enviroment variable:
```js
ES_JAVA_OPTS=-Xms256m -Xmx256m
```
elasticsearch has https connection security which means that data needs to be encoded with ssl but, to override this i used this enviroment variable:
```js
xpack.security.enabled=false
```
and to specify only one node of elasticsearch i used the enviroment variable:
```js
discovery.type=single-node
```
extra:
```js
ulimits:
      memlock:
        soft: -1
        hard: -1
```
Kibana is nice to run with elasticsearch, its very easy to see the data stored and easy to make queries.
To delete all indices in the database after testing i used this function
```js
async function trash_database()
{
    get_branch_names
    ((indices) => {
        elasticClient.indices.delete({
            index: indices
        })
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
```
# winston (logger)
I used winston logger library to log into seperate files for each of the modules. Very helpful in debugging.
# config files
I used one config file which is ES module and exports the configurations.
I found it very helpfull to hide private details from the view and it's comfortable to know that all those are in one spot.
# Async Developement(promises, callbacks)
I got an advice from my lecturer that writing sync code for a server is not serious, and should not be used. It stuck with me. And makes a lot of sense because sync code will cause the whole app to wait for a task to be done, like interacting with bigml if it was sync then for 15 seconds or more the application is stuck waiting for a respnse from bigml server.
# Docker (docker images, docker-compose)
At first I thought working with docker requires to have images downloaded on docker desktop. Yet then I realized that calling docker-compose up actually downloads the images for you, if you don't have them yet. 
# Git (gitignore)
I used fairly simple gitignore i found to ignore node modules and package, and logs, and my config file.
# Server side Rendering (EJS)
I used card based design to server side render with ejs.
Card based design looks like this:
![image](https://user-images.githubusercontent.com/82415308/225989244-15448d44-ac3c-483d-a3ca-55d86f7b1852.png)
where we can see that we have 4 main components inside our body tag, which is the navigation bar on top which tells up where we are, the content of the page i.e search.ejs, and the sidebar which has links to traverse the site, and a results card which contains the result from the search in this particular page.
* to pass data from node to the cards, we can use:
```js
res.render('where we are', data)
```
Whereas data is an object in js
# Full Duplex Communication(WebSockets protocol)
I used Web Sockets protocol to communicate with the client from the server side. To update the Hot data the user sees whenever an order is recieved by kafka. 
Server side emitting
```js
function recieve_order(order)
{
    order = JSON.parse(order)
    dashboardlogic.process_order(order)
    searchlogic.process_order(order)
    analizelogic.process_order(order)
    io.emit('update', dashboardlogic.get_data())
}
```
Client side recieving:
```js
var socket = io('localhost:3000');
    socket.on('update', (data) =>{
        console.log('recieved update')
        document.getElementById("open_branches").firstChild.innerHTML = 'Open Branches: \n' + data.branches;
        document.getElementById("avg_handle_time").firstChild.innerHTML = "Avg Treatmnt Time: \n"+ (Math.round(data.avg * 100) / 100).toFixed(2);
        document.getElementById("orders_inprog").firstChild.innerHTML = "Orders In Progress: \n" +data.open_orders;
        document.getElementById("total_orders").firstChild.innerHTML = "Total Orders: \n" +data.total;
        document.getElementById("time").innerHTML = "Last Updated Date: " + data.time;
        make_horizontal_histogram('top_5_toppings', data.toppings,100);
        make_pie_chart('orders_by_region', data.orders_by_region);
        make_horizontal_histogram('top_5_branch_ordertime', data.avg_duration_per_region, 300);
        make_graph('total_orders_during_day', data.time_order)
```


# Dashboard (d3 library)
I used D3JS library to make and style graphs in the dashboard. 

# Pizza Simulator
In this project to generate the orders, I used a simulator that opens branches as threads which each one has a worker slack number, and number of average orders which is randomly generated between a range. Each branch has a Producer thread and a Consumer thread. The producer thread is generating orders, and the consumer thread is recieving orders from the producer and working on them. when each thread finished an order, then it sends the javascript nodejs server to knowledge that the order was opened or finished.</br>
Sample code for work function of a branch:
```python
def work(self):
        producer = threading.Thread(target=self.recieve_orders,name="producer thread")
        consumer = threading.Thread(target=self.handle_orders, name="consumer thread")
        consumer.start()
        producer.start()
        threading.Thread.join(consumer)
        threading.Thread.join(producer)
```
Sample code for start function of a company which starts all the branches work fucntion
```python
async def start(self):
        # get the coroutine objects
        lst = []
        for branch in self.branches:
            lst.append(threading.Thread(target=branch.work))
        for branch_worker in lst: branch_worker.start()
        for branch_worker in lst: threading.Thread.join(branch_worker)
```
* Note that there is difference between run(), and start(). start() opens a new thread that excecuts the task, and run() excecute the task on the current thread instead.
# Mocha- Chai Testing
![image](https://user-images.githubusercontent.com/82415308/225611279-bc910309-cb89-490a-a103-91442a7dfe4c.png)

![image](https://user-images.githubusercontent.com/82415308/225610830-8e868ecf-0c69-42e9-9bc1-879bf12e9f50.png)


# Images of the System:
### Dashboard
![image](https://user-images.githubusercontent.com/82415308/226000331-8d407742-7b31-435d-b61b-0b77eb4f27c9.png)
![image](https://user-images.githubusercontent.com/82415308/226000414-dcc2dcab-8d65-4592-bd3f-82374b897272.png)
![image](https://user-images.githubusercontent.com/82415308/226000474-5eb2b6f5-d322-4bdd-9621-4fef453d70ef.png)
### Search
![image](https://user-images.githubusercontent.com/82415308/226001106-fab999c5-c8b9-43e2-8fc3-a30945e0dda8.png)
### Analyze
![image](https://user-images.githubusercontent.com/82415308/226043256-802cd089-4f1e-4e61-934d-215c57d6ca48.png)


