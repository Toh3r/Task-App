const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/index');
const User = require('../src/models/user');

// Create a test user object
const userOneId = new mongoose.Types.ObjectId();
const testUserOne = {
    _id: userOneId,
    name: 'Alan',
    email: 'alan@fake.email',
    password: 'pass1337!',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

// Test Setup
beforeEach(async () => {
    await User.deleteMany(); // Remove users from db before tests are run
    await new User(testUserOne).save(); // Create test user
});

test('Should signup a new user', async () => {
    await request(app).post('/user').send({
        name: 'Daniel',
        email: 'dan@fake.email',
        password: 'pass1337!'
    }).expect(201);
});

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: testUserOne.email,
        password: testUserOne.password
    }).expect(200);
});

test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: testUserOne.email,
        password: 'badUserPass'
    }).expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should delete account for user', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
    .send()
    .expect(200);
});