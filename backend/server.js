const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
require('dotenv').config();


const app = express();

connectDB();


app.use(cors());


app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://www.pennypilot.dev'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);  
});


app.use(express.json());

app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
