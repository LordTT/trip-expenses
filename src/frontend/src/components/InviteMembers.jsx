import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTripStore from '../store/tripStore';
import useAuthStore from '../store/authStore';
import { userAPI } from '../services/api';

const InviteMembers = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { currentTrip, getTripById, addTripMember } = useTripStore();
  const { user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if user is already a member
      if (currentTrip?.members?.some(member => member.email === email)) {
        throw new Error('User is already a member of this trip');
      }

      // Find user by email
      const userData = await userAPI.findByEmail(email);
      
      // Add member to trip
      await addTripMember(tripId, userData.data._id);
      
      // Reset form
      setEmail('');
      setError('');
    } catch (err) {
      console.error('Invite error:', err); // Log the full error for debugging
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentTrip) {
    return <div className="text-center py-8">Loading trip...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Invite Members to {currentTrip.name}</h2>
      
      <form onSubmit={handleInvite} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="friend@example.com"
          />
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate(`/trips/${tripId}`)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'Inviting...' : 'Invite Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InviteMembers;