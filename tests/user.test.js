const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/index");
const User = require("../src/models/user");

// Create a test user object
const userOneId = new mongoose.Types.ObjectId();
const testUserOne = {
  _id: userOneId,
  name: "Alan",
  email: "alan@fake.email",
  password: "pass1337!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

// Test Setup
beforeEach(async () => {
  await User.deleteMany(); // Remove users from db before tests are run
  await new User(testUserOne).save(); // Create test user
});

test("Should signup a new user", async () => {
  const res = await request(app)
    .post("/user")
    .send({
      name: "Daniel",
      email: "dan@fake.email",
      password: "pass1337!",
    })
    .expect(201);

  // Grab Created user from db
  const user = await User.findById(res.body.user._id);
  expect(user).not.toBeNull(); // Assert user exists

  // Assertions about response
  expect(res.body).toMatchObject({
    user: {
      name: "Daniel",
      email: "dan@fake.email",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("pass1337");
});

test("Should login existing user", async () => {
  const res = await request(app)
    .post("/users/login")
    .send({
      email: testUserOne.email,
      password: testUserOne.password,
    })
    .expect(200);

  // Grab Created user from db
  const user = await User.findById(userOneId);
  expect(res.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexisting user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: testUserOne.email,
      password: "badUserPass",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${testUserOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test('Should upload avatar image', async () => {
    await request(app)
    .post('/users/me/avatar')
    .set("Authorization", `Bearer ${testUserOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('should update valid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set("Authorization", `Bearer ${testUserOne.tokens[0].token}`)
    .send({
        name: 'Alan'
    })
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Alan');
});

test('should not update invalid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set("Authorization", `Bearer ${testUserOne.tokens[0].token}`)
    .send({
        location: 'The Moon'
    })
    .expect(400);
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${testUserOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});
