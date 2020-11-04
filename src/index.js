// This file sets up express for tests and is also 
// exported to app.js to initiliaze the application

const express = require('express');
// For DB connection
require('./db/mongoose');

// Import router files
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// Configure express
const app = express();

app.use(express.json()); // Auto parse incoming JSON into an object

// Use these routes routes
app.use(userRouter);
app.use(taskRouter);

module.exports = app;