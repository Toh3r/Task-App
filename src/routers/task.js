const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = new express.Router();

// Get all tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {};

    // filter tasks by completed
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    // Sort data using query params
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        // const tasks = await Task.find({ owner: req.user._id });

        // Filter returned tasks
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip:  parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send();
    }
});

// Get a task using dynamic endpoint
router.get('/tasks/:id', auth, async (req, res) => {
    // Contains route params
    const _id = req.params.id;

    try {
        // Only return task if is linked to owner
        const task = await Task.findOne({ _id, owner: req.user._id })
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
router.patch('/tasks/:id', auth, async (req, res) => {
    const aUpdates = Object.keys(req.body);
    const aAllowedUpdates = ['description', 'completed'];
    const isValid = aUpdates.every((update) => aAllowedUpdates.includes(update));

    if (!isValid) {
        return res.status(400).send({error: 'Not a valid update'})
    }

    try {
        // Only return task if linked to owner
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        // Update and save task
        aUpdates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task); // return updated task to user
    } catch (e) {
        res.status(400).send();
    }
});

// Remove Task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;