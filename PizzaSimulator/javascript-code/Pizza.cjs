const express = require('express')
const bodyParser = require('body-parser')
const produce_message = require('./KafkaProducer.cjs')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port = 3001

var kafkaready = 'not-ready'
const avaiableMessages = []

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/kafkaready',(req, res) => {
  kafkaready = 'ready'
  console.log('got kafka ready')
})


app.post('/', (req, res) =>{
    let data = req.body;
    console.log(req.body)
    res.send(JSON.stringify(data))
    avaiableMessages.push(data)
    // kafka is ready to send messages to
    // then empty out everything
    console.log(kafkaready)
    if(kafkaready === 'ready')
    {
      console.log('sending message')
      while(avaiableMessages.length > 0)
      {
        var msg = avaiableMessages.pop()
        produce_message(JSON.stringify(msg))
      }
    }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})