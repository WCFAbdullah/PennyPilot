const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
require('dotenv').config();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const app = express();

connectDB();

// Configure CORS to allow specific origin
app.use(cors({
    origin: 'https://www.pennypilot.dev/dashboard', // Allow this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    credentials: true, // Allow cookies, authorization headers, etc.
}));

app.use(express.json());
app.use('/api/expenses', ClerkExpressRequireAuth(), expenseRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
