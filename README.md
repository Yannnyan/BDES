# BDES
Big Data Enterprise System </br>
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

# Big Data Pizza Information system 🍕
1) This project represents a Big Data information system to manage orders in real time of a company, say a pizza company, which has several branches that deliver order information to the system. 
2) The Orders are delivered by a Pizza company simulator, which runs on python then for each order information ready to deliver send http message to a small nodejs which is connected to kafka and it's purpose is to store the orders untill kafka is ready to deliver them, and then deliver them using kafka producer. 
* Note - In this project kafka is not running localy, instead I used Cloud service CloudKarafka.
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

# Redis (docker image)
# Mongodb (mongoose ODM, cloud atlas)
# Nodejs express 
# Bigml(cloud)
# Elasticsearch(docker image)
# winston (logger)
# config files
# Async Developement(promises, callbacks)
# Docker (docker images, docker-compose)
# Git (gitignore)
# Server side Rendering (EJS)
# Full Duplex Communication(WebSockets protocol)
# Lambda Architecture(Hot channel (redis)
# cold channel(bigml, mongodb, elasticsearch))
# Dashboard (d3 library)
# Mocha- Chai Testing
![image](https://user-images.githubusercontent.com/82415308/225611279-bc910309-cb89-490a-a103-91442a7dfe4c.png)

![image](https://user-images.githubusercontent.com/82415308/225610830-8e868ecf-0c69-42e9-9bc1-879bf12e9f50.png)
