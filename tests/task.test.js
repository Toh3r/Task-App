const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/index");
const {
  userOneId,
  testUserOne,
  userTwoId,
  testUserTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
} = require("./fixtures/db");

// Test Setup
beforeEach(setupDatabase);

test("should create task for user", async () => {
  const res = await request(app)
    .post("/task")
    .set("Authorization", `Bearer ${testUserOne.tokens[0].token}`)
    .send({
      description: "Why Task",
    })
    .expect(201);

  const task = await Task.findById(res.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test("should get all tasks for a user", async () => {
  const res = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${testUserOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(res.body.length).toBe(2);
});

test('should not delete other users tasks', async () => {
    const res = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${testUserTwo.tokens[0].token}`)
    .send()
    .expect(404);

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});
