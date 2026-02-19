const express = require('express');
const router = express.Router();
const {
  addExpense,
  getExpensesByTrip,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, addExpense);
router.route('/trip/:tripId').get(protect, getExpensesByTrip);
router.route('/delete/:expenseId').delete(protect, deleteExpense);

module.exports = router;
