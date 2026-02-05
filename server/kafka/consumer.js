import { kafka } from "./setup.js";

const consumer = kafka.consumer({ groupId: "analytics" });

const consumerFunc = async (io) => {
  await consumer.connect();
  await consumer.subscribe({ topic: "update-clicks" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("Consumer Data", data);

      io.emit("click-event", {
        shortString: data.shortString,
        totalClicks: data.totalClicks,
        timeStamp: data.timeStamp,
      });
    },
  });
};

export { consumerFunc };
