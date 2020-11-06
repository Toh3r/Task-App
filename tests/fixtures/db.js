const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

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

const userTwoId = new mongoose.Types.ObjectId();
const testUserTwo = {
  _id: userTwoId,
  name: "Aoife",
  email: "aoife@fake.email",
  password: "pass1338!",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learn Mongoose',
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learn Chess',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learn Sockets',
    completed: true,
    owner: userTwoId
}

const setupDatabase = async () => {
    await User.deleteMany(); // Remove users from db before tests are run
    await Task.deleteMany();
    await new User(testUserOne).save(); // Create test user
    await new User(testUserTwo).save(); // Create test user

    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneId,
    testUserOne,
    userTwoId,
    testUserTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase,
}