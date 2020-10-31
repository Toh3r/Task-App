const mongoose = require('mongoose');

// Conect to db server, adding in db name at the end
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
