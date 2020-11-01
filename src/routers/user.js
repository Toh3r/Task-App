const express = require('express');
const { update } = require('../models/user');
const User = require('../models/user');
const router = new express.Router();

// Create New User
router.post('/user', async (req, res) => {    
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Login a user
router.post('/users/login', async (req, res) => {
    try {
        // Find user by email and password
        const user = await User.findByCredentials(req.body.email, req.body.password);

        // Create JWT for user to keep them logged in
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send();
    }
});

// Get a user using dynamic endpoint
router.get('/users/:id', async (req, res) => {
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

// Update user
router.patch('/users/:id', async (req, res) => {
    const aUpdates = Object.keys(req.body);
    const aAllowedUpdates = ['name', 'email', 'password', 'age'];
    const isValid = aUpdates.every((update) => aAllowedUpdates.includes(update));

    if (!isValid) {
        return res.status(400).send({error: 'Not a valid update'})
    }

    try {
        const user = await User.findById(req.params.id);
        aUpdates.forEach((update) => user[update] = req.body[update]);
        await user.save();

        // new: true = return updateed user
        // runVaildators, run validators for updated user
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(400).send();
    }
});

// Remove User
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;