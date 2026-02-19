const Trip = require('../models/Trip');
const User = require('../models/User');

const createTrip = async (req, res) => {
  try {
    const { name, description, members, startDate, endDate } = req.body;

    const trip = await Trip.create({
      name,
      description,
      members: members || [req.user._id],
      startDate,
      endDate,
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrips = async (req, res) => {
  try {
    // Find trips where user is a member
    const trips = await Trip.find({ members: req.user._id })
      .populate('members', 'username email')
      .sort('-createdAt');

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId)
      .populate('members', 'username email')
      .populate({
        path: 'expenses',
        populate: { path: 'paidBy', model: 'User', select: 'username email' },
      });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is a member of the trip
    if (!trip.members.some((member) => member._id.toString() === req.user._id.toString())) {
      return res
        .status(403)
        .json({ message: 'You are not a member of this trip' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTripMember = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.body;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!trip.members.includes(userId)) {
      trip.members.push(userId);
      await trip.save();
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTrip = async (req, res) => {
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

    await trip.deleteOne();

    res.json({ message: 'Trip removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  addTripMember,
  findUserByEmail,
  deleteTrip,
};
