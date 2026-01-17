import request from "supertest";
import app from "../../app.js";
import "../mongoSetup.js";
import Auth from "../../models/Auth.js";

describe("/api/auth routes", () => {
  const agent = request.agent(app);
  test("should return status 200 on succesful registration", async () => {
    await agent
      .post("/api/auth/register")
      .send({
        profileName: "Test",
        email: "test@example.com",
        password: "helloworld",
      })
      .expect(200);
  });

  test("should return status 400 if user registered already", async () => {
    const newUser = {
      profileName: "Test",
      email: "test@example.com",
      password: "helloworld",
    };
    await agent.post("/api/auth/register").send(newUser).expect(400);
  });

  test("should return status 400 if not a valid email", async () => {
    await agent
      .post("/api/auth/register")
      .send({ profileName: "Aadhi", email: "fsdjnf", password: "sjgfsdjhfs" })
      .expect(400);
  });

  test("should return status 400 if the minimum password lenght is not greater or equal to 8", async () => {
    await agent
      .post("/api/auth/register")
      .send({
        profileName: "Aadhi",
        email: "hello@hello.com",
        password: "sjgf",
      })
      .expect(400);
  });

  test("should return 200 status on successful login when the user is verified", async () => {
    const user = await Auth.create({
      profileName: "test",
      email: "test@test.com",
      password: "hellotest",
      isVerified: true,
    });
    await agent
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "hellotest" })
      .expect(200);
  });

  test("should not login when the user is not verified", async () => {
    const user2 = await Auth.create({
      profileName: "test2",
      email: "test2@test.com",
      password: "hellotest2",
    });
    await agent
      .post("/api/auth/login")
      .send({ email: "test2@test.com", password: "hellotest2" })
      .expect(400);
  });
});
