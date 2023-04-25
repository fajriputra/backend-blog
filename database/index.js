const mongoose = require("mongoose");
const { dbUser, dbPass, dbName } = require("../app/config");

mongoose.set("strictQuery", false);
mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPass}@cluster0.nk5otan.mongodb.net/${dbName}?retryWrites=true&w=majority`
);

const db = mongoose.connection;

module.exports = db;
