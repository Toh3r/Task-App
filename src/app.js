const express = require('express');
// For DB connection
require('./db/mongoose');

// Import router files
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// Configure express
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Auto parse incoming JSON into an object

// Use these routes routes
app.use(userRouter);
app.use(taskRouter);

// Listen on port whatever
app.listen(port, () => {
    console.log(`Port is up on ${port}...`);
});

const User = require('./models/user');

const main = async () => {
    const user = await User.findById('5f9f1271fb82806644af1968')
    await user.populate('tasks').execPopulate();
    console.log(user.tasks);
}

// main()