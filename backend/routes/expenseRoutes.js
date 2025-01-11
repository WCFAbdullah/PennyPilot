const express = require('express');
const router = express.Router();
const { 
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// All routes are protected with Clerk authentication
router.use(ClerkExpressRequireAuth());

router.route('/')
    .get(getExpenses)
    .post(createExpense);

router.route('/:id')
    .put(updateExpense)
    .delete(deleteExpense);

module.exports = router; 