const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

const addExpense = async (req, res) => {
  try {
    const { description, amount, currency, tripId, participants } = req.body;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is a member of the trip
    if (!trip.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'You are not a member of this trip' });
    }

    const expense = await Expense.create({
      description,
      amount,
      currency: currency || 'USD',
      paidBy: req.user._id,
      trip: tripId,
      participants: participants || [req.user._id],
    });

    // Add expense to trip's expenses array
    await Trip.findByIdAndUpdate(tripId, {
      $push: { expenses: expense._id },
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExpensesByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is a member of the trip
    if (!trip.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'You are not a member of this trip' });
    }

    const expenses = await Expense.find({ trip: tripId })
      .populate('paidBy', 'username email')
      .populate('participants', 'username email')
      .sort('-createdAt');

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if user is the one who paid or a trip admin
    if (
      expense.paidBy.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this expense' });
    }

    // Get the trip ID before deleting the expense
    const tripId = expense.trip;

    await expense.deleteOne();

    // Remove expense from trip's expenses array
    await Trip.findByIdAndUpdate(tripId, {
      $pull: { expenses: expense._id },
    });

    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addExpense, getExpensesByTrip, deleteExpense };
