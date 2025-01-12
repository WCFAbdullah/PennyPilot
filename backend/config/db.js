const mongoose = require('mongoose');
require ('dotenv').config();

const connectDB = async () => {           // Connecting to database
    try {
        const dbURI = process.env.MONGODB_URI;
        const conn = await mongoose.connect(dbURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 
