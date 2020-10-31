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
app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users);     
    }).catch((e) => {
        res.status(500).send();
    })
});

// Get a user using dynamic endpoint
app.get('/users/:id', (req, res) => {
    // Contains route params
    const _id = req.params.id;

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);     
    }).catch((e) => {
        res.status(500).send();
    })
});

// Get all tasks
app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks);     
    }).catch((e) => {
        res.status(500).send();
    })
});

// Get a task using dynamic endpoint
app.get('/tasks/:id', (req, res) => {
    // Contains route params
    const _id = req.params.id;

    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);     
    }).catch((e) => {
        res.status(500).send();
    })
});

// Save a User to the DB
app.post('/user', (req, res) => {    
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201).send(user)
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// Save a Task to the DB
app.post('/task', (req, res) => {    
    const task = new Task(req.body);
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log(`Port is up on ${port}...`);
});