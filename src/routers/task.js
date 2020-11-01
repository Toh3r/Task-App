const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = new express.Router();

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
});

// Get a task using dynamic endpoint
router.get('/tasks/:id', async (req, res) => {
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

// Save a Task to the DB
router.post('/task', auth, async (req, res) => {
    // Link task to user that created it
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Update task
router.patch('/tasks/:id', async (req, res) => {
    const aUpdates = Object.keys(req.body);
    const aAllowedUpdates = ['description', 'completed'];
    const isValid = aUpdates.every((update) => aAllowedUpdates.includes(update));

    if (!isValid) {
        return res.status(400).send({error: 'Not a valid update'})
    }

    try {
        const task = await Task.findById(req.params.id);
        aUpdates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(400).send();
    }
});

// Remove Task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;