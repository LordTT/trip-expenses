const express = require('express');
const router = express.Router();
const {
  createTrip,
  getTrips,
  getTripById,
  addTripMember,
  findUserByEmail,
  deleteTrip,
} = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createTrip).get(protect, getTrips);
router.route('/:tripId').get(protect, getTripById).delete(protect, deleteTrip);
router.post('/:tripId/members', protect, addTripMember);
router.get('/find-user-by-email', protect, findUserByEmail);

module.exports = router;
