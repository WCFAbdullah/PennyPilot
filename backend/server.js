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
  "https://penny-pilot-iota.vercel.app/",
  "https://anothertrusteddomain.com",
];

connectDB();

// CORS setup with allowed origins
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
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

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
