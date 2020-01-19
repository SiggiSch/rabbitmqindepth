import { connect } from "amqplib";
import { rabbitUrl } from "./main";

export async function receive(queueName: string, routingKey: string) {
  console.log("Consumer STARRRRT");
  const connection = await connect(rabbitUrl);
  const channel = await connection.createChannel();
  const queue = await channel.checkQueue(queueName);
  // const queue = await channel.assertQueue(queueName);

  const consumer = await channel.consume(queueName, msg => {
    console.log(
      "received message: ",
      JSON.parse(Buffer.from(msg.content).toString(), null),
      msg.properties.headers.count
    );
    // if (msg.properties.headers.count && msg.properties.headers.count === 5) {
    //   channel.ack(msg, true);
    // }
    channel.ack(msg);
  });
  console.log("consumerrrr", consumer);
}
