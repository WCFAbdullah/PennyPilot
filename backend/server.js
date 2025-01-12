const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', expenseRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
