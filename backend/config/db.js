const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    const conn = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (conn.connection.readyState === 1) {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`Error with mongo: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
