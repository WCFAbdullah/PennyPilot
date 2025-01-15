const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
require("dotenv").config();
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const app = express();

// Allowed origins (whitelisted domains or addresses)
const allowedOrigins = [
  "http://localhost:5173",
  "https://penny-pilot-iota.vercel.app",
  "https://penny-pilot-abdullahs-projects-a3074dd7.vercel.app",
];

connectDB();

// CORS setup with allowed origins
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// Apply Clerk authentication and expense routes
app.use("/api/expenses", ClerkExpressRequireAuth(), expenseRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the Express app as a Vercel serverless function
module.exports = app;
