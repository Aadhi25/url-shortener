import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "realtime-clicks",
  brokers: ["localhost:9092"],
});

export { kafka };
