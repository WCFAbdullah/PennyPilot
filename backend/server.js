const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
require("dotenv").config();

const app = express();

// Add health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});

// ...existing CORS setup...

app.use(express.json());
app.use("/api/expenses", expenseRoutes);

// Only start server in development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
