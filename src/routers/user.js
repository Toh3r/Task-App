const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth')
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

// Log User Out of current sessions
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save();

        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});

// Log User Out of all sessions
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});

// Return own users profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// Update user
router.patch('/users/me', auth,  async (req, res) => {
    const aUpdates = Object.keys(req.body);
    const aAllowedUpdates = ['name', 'email', 'password', 'age'];
    const isValid = aUpdates.every((update) => aAllowedUpdates.includes(update));

    if (!isValid) {
        return res.status(400).send({error: 'Not a valid update'})
    }

    try {
        aUpdates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send();
    }
});

// Remove User
router.delete('/users/me', auth, async (req, res) => {
    try {
        // Remove user from db
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

// Configure Multer
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please Upload an image'));
        }

        cb(undefined, true);
    }
});

// Upload User Avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // Save file without any manipulation
    // req.user.avatar = req.file.buffer;

    // Use sharp to change file
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

// Delete User Avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

// Get User Avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;