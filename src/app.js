const app = require('./index');
const port = process.env.PORT;

// Listen on port whatever
app.listen(port, () => {
    console.log(`Port is up on ${port}...`);
});
