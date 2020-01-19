import { connect } from "amqplib";
import { receive } from "./receiver";

export const rabbitUrl = "amqp://guest:guest@localhost";
const routingKey = "example-routing-key";
const queueName = "example";
const exchangeName = "chapter2-example";

async function main(...args: any[]) {
  console.log("Publischer STARRRRT");

  const connection = await connect(rabbitUrl);
  const channel = await connection.createChannel();

  const exchange = await channel.assertExchange(exchangeName, "direct");
  channel.checkExchange(exchangeName);

  const queue = await channel.assertQueue(queueName);
  await channel.bindQueue(queue.queue, exchange.exchange, routingKey);

  const getMessage = function*() {
    let count = 0;
    while (count < 10) {
      count++;
      yield { F: `you * ${count}`, count };
    }
  };
  const messages = getMessage();
  for (const message of messages) {
    console.log("mmm", message);

    channel.publish(
      exchange.exchange,
      routingKey,
      Buffer.from(JSON.stringify(message, null, 2)),
      {
        contentType: "application/json",
        expiration: 60000,
        headers: {
          count: message.count
        }
      }
    );
  }

  console.log(exchange, queue);
}

main().catch(err => console.log("ERRRRR: ", err));
setTimeout(() => {
  receive(queueName, routingKey);
}, 1000);
