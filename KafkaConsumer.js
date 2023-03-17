import Kafka from 'node-rdkafka';
import fetch from 'node-fetch';
import {config} from './config.js'
import { recieve_order } from './app.js';

const kafkaConf = config.kafkaConf

const topic = config.kafka_topic;
const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning"
});
async function connectKafka()
{
  consumer.on("error", async function(err) {
    console.error(err);
  });
  consumer.on("ready", async function(arg) {
    console.log(`Consumer ${arg.name} ready`);
    consumer.subscribe(topics);
    consumer.consume();
  });
  consumer.on("data", async function(m) {
      // fetch('http://localhost:3000/order' ,{method: "POST", // *GET, POST, PUT, DELETE, etc.
      //   mode: "cors", // no-cors, *cors, same-origin
      //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //   credentials: "same-origin", // include, *same-origin, omit
      //   headers: {
      //     "Content-Type": "application/json",
      //     // 'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      //   redirect: "follow", // manual, *follow, error
      //   referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //   body: m.value.toString(), // body data type must match "Content-Type" header
      // });
      recieve_order(m.value.toString())
      consumer.commit(m);
      console.log(m.value.toString());
    })
  
  consumer.on("disconnected", async function(arg) {
    process.exit();
  });
  consumer.on('event.error', async function(err) {
    console.error(err);
    process.exit(1);
  });
  consumer.on('event.log', async function(log) {
    console.log(log);
  });
  consumer.connect();
  
}

export{connectKafka}
