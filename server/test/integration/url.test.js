import request from "supertest";
import app from "../../app.js";
import "../mongoSetup.js";

describe("/api/user/", () => {
  const agent = request.agent(app);
  test("rate limiter should work correctly", async () => {
    await agent
      .post("/api/auth/register")
      .send({
        profileName: "you",
        email: "hello@world.com",
        password: "helloworld",
        isVerified: true,
      })
      .expect(200);
    // const users = await Auth.find({});
    // console.log(users);
    await agent
      .post("/api/auth/login")
      .send({ email: "hello@world.com", password: "helloworld" })
      .expect(200);
  });

  test("rate limiter works after login", async () => {
    for (let i = 0; i < 10; i++) {
      await agent
        .post("/api/user/create-short-url")
        .send({
          longUrl: `https://test${i}.com`,
        })
        .expect(200);
    }

    await agent
      .post("/api/user/create-short-url")
      .send({
        longUrl: "https://www.google.com",
      })
      .expect(429);
  });
});
