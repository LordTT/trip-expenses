import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTripStore from '../store/tripStore';
import { tripAPI } from '../services/api';

const TripList = () => {
  const { trips, getTrips, deleteTrip, isLoading, error, clearError } = useTripStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTrip, setNewTrip] = useState({ name: '', description: '' });

  useEffect(() => {
    // Load trips when component mounts
    getTrips();
  }, [getTrips]);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await tripAPI.create(newTrip);
      setNewTrip({ name: '', description: '' });
      setShowCreateModal(false);
      await getTrips();
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(tripId);
      } catch (error) {
        console.error('Failed to delete trip:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Trips</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Create New Trip
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading trips...</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-600 text-lg mb-4">No trips yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Create your first trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link
              to={`/trips/${trip._id}`}
              key={trip._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition block"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {trip.name}
                </h3>
                {trip.description && (
                  <p className="text-gray-600 mb-4">{trip.description}</p>
                )}
                <div className="text-sm text-gray-500 mb-4">
                  {trip.members?.length || 0} member
                  {(trip.members?.length || 0) !== 1 && 's'}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {trip.startDate
                      ? new Date(trip.startDate).toLocaleDateString()
                      : 'No start date'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering link click
                      handleDeleteTrip(trip._id)
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Trip</h2>
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={newTrip.name}
                  onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTrip.description}
                  onChange={(e) => setNewTrip({ ...newTrip, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripList;
