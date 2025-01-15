const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
require("dotenv").config();

const app = express();

// Add a test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Connect to DB
connectDB();

// ...existing CORS setup...

app.use(express.json());

// Routes
app.use("/api/expenses", expenseRoutes);

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
