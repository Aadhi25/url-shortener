export default {
  testEnvironment: "node",
  // Enable ES Modules
  transform: {},
  roots: ["./test"],
  setupFilesAfterEnv: ["<rootDir>/test/mongoSetup.js"],
  setupFiles: ["dotenv/config"],
};
