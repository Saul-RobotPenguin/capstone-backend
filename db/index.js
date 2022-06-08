require("dotenv").config();
const mongoose = require("mongoose");

let MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

mongoose
  .connect(MONGODB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;

module.exports = db;
