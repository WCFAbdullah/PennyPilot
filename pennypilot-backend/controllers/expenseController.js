const Expense = require("../models/expenseModel");

// Get all expenses for a user
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.auth.userId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new expense
const createExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    const expense = await Expense.create({
      userId: req.auth.userId,
      date,
      description,
      amount,
      category,
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an expense
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ message: "Expense removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
