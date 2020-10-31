const express = require('express');
// For DB connection
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task')

const app = express();
const port = process.env.PORT || 3000;

// Auto parse incoming JSON into an object,
app.use(express.json());

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send();
    }
});

// Get a user using dynamic endpoint
app.get('/users/:id', async (req, res) => {
    // Contains route params
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
});

// Get a task using dynamic endpoint
app.get('/tasks/:id', async (req, res) => {
    // Contains route params
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});

// Save a User to the DB
app.post('/user', async (req, res) => {    
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Save a Task to the DB
app.post('/task', async (req, res) => {    
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Listen on port whatever
app.listen(port, () => {
    console.log(`Port is up on ${port}...`);
});