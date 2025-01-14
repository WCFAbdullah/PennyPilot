const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
require('dotenv').config();

const app = express();

connectDB()

const corsOptions = {
    origin: 'https://www.pennypilot.dev',  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
    allowedHeaders: ['Authorization'],
    credentials: true,  
};

app.use(cors(corsOptions));  

app.use(express.json());

app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
