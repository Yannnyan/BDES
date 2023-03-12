// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const Kafka = require("node-rdkafka");

import {config} from './config.js'

var kafkaConf = config.kafkaConf
kafkaConf['group.id'] = undefined

const topic = config.kafka_topic;
const producer = new Kafka.Producer(kafkaConf);
const maxMessages = 1;

const genMessage = i => Buffer.from(`'kafka hello hello' ${i}`);

producer.on("ready", function(arg) {
  console.log(`producer ${arg.name} ready.`);
  for (var i = 0; i < maxMessages; i++) {
    producer.produce(topic, -1, genMessage(i), i);
  }
  setTimeout(() => producer.disconnect(), 10000);
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