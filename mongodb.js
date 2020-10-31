// Require mongo library
const mongodb = require("mongodb");

// Create a client to connect to db
const MongoClient = mongodb.MongoClient;

// Create db vars
const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

// Connect to db server
MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      return console.log("Unable to connect to db...");
    }

    // Db you want to manipulate
    const db = client.db(databaseName);

    db.collection("users")
      .deleteMany({
        age: 28,
      })
      .then((res) => {
        // On success
        console.log(res);
      })
      .catch((err) => {
        // On error
        console.log(err);
      });
  }
);
