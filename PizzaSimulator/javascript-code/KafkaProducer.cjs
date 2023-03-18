// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const fetch = require('node-fetch')
const config = require('./config.js')

const kafkaConf = config.kafkaConf

const topic = config.kafkaTopic;
const producer = new Kafka.Producer(kafkaConf);
var msg_num = 1
const maxMessages = 1;

const genMessage = msg => Buffer.from(msg);

producer.on("ready", function(arg) {
  console.log(`producer ${arg.name} ready.`);
  fetch('http://localhost:3001/kafkaready')
  .then((res) => console.log('sent_message'))
});

producer.on("disconnected", function(arg) {
  process.exit();
});

producer.on('event.error', function(err) {
  console.error(err);
  process.exit(1);
});
producer.on('event.log', function(log) {
  console.log(log);
});
producer.connect();

function produce_message(msg)
{
  producer.produce(topic, -1, genMessage(msg), msg_num)
  setTimeout(() => producer.disconnect(), 100000000);
  msg_num += 1
}

module.exports = produce_message
