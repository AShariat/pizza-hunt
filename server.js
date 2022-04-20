const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

// Set up Mongoose to connect when we start the app. In the preceding code, mongoose.connect() tells Mongoose which database we want to connect to. If the environment variable MONGODB_URI exists, like on Heroku when we deploy later, it will use that. Otherwise, it will short-circuit to the local MongoDB server's database at mongodb://localhost:27017/pizza-hunt. The second argument in the example is a set of configuration options Mongoose asks for more information about. MongoDB will find and connect to the database if it exists or create the database if it doesn't.
// Just like JawsDB with MySQL-based applications, we want to set up our Pizza Hunt application so it tries to connect to a production database first and falls back to the local database's connection when it's in development.
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/pizza-hunt",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// Use this to log mongo queries being executed!
mongoose.set("debug", true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
