const express = require("express");
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware"); // Import the JWT middleware

// Protect the routes with JWT
router.use(protect);

router.route("/").get(getExpenses).post(createExpense);

router.route("/:id").put(updateExpense).delete(deleteExpense);

module.exports = router;
