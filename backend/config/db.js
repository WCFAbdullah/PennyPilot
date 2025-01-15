const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  // Connecting to database
  try {
    const dbURI =
      "mongodb+srv://tahashahid246:BK897zdF3oCdFBoF@pennypilotmdbcluster.nltbazy.mongodb.net/";
    const conn = await mongoose.connect(dbURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error with mongo: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
