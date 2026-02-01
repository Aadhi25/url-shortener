import { Kafka } from "kafkajs";

const format = (val) => (val ? val.replace(/\\n/g, "\n") : null);

const kafka = new Kafka({
  clientId: "realtime-clicks",
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    ca: [format(process.env.KAFKA_CA_CERTIFICATE)],
    rejectUnauthorized: true,
    key: format(process.env.KAFKA_ACCESS_KEY),
    cert: format(process.env.KAFKA_CERT),
  },
});

export { kafka };
