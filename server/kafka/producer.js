import { kafka } from "./setup.js";

const producer = kafka.producer();

export { producer };
