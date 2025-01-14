const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
require('dotenv').config();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const app = express();

connectDB();

app.use(cors({
    origin: ['https://www.pennypilot.dev', 'https://pennypilot.dev'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
    allowedHeaders: ['Authorization'],
    credentials: true, 
}));


app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();  
  }
  next();
});


app.use(ClerkExpressRequireAuth());

app.use(express.json());


app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
