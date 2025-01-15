const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
require("dotenv").config();

const app = express();
connectDB();
// Add health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});

// ...existing CORS setup...

app.use(express.json());
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 3000; // Use the PORT from environment, or 3000 as fallback

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
