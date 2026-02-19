import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTripStore from '../store/tripStore';
import useExpenseStore from '../store/expenseStore';
import useAuthStore from '../store/authStore';

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { currentTrip, getTripById, isLoading: tripLoading } = useTripStore();
  const { expenses, getExpensesByTrip, addExpense, deleteExpense, isLoading: expenseLoading, error } = useExpenseStore();
  const { user } = useAuthStore(); // Get user from auth store
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    currency: 'USD',
    participants: [],
  });

  useEffect(() => {
    if (tripId) {
      getTripById(tripId);
      getExpensesByTrip(tripId);
    }
  }, [tripId, getTripById, getExpensesByTrip]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    try {
      // If no participants selected, default to the current user
      const participantsToSubmit = newExpense.participants.length > 0 
        ? newExpense.participants 
        : [user._id]; // Use current user as default participant
      
      await addExpense({
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        currency: newExpense.currency,
        tripId: tripId,
        participants: participantsToSubmit,
      });
      setNewExpense({ description: '', amount: '', currency: 'USD', participants: [] });
      setShowAddExpenseModal(false);
      await getExpensesByTrip(tripId);
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
    }
  };

  const calculateBalances = () => {
    if (!expenses.length || !currentTrip?.members?.length) return {};

    const balances = {};
    
    // Initialize balances for all members
    currentTrip.members.forEach(member => {
      balances[member._id] = {
        name: member.username,
        paid: 0,
        owed: 0,
        balance: 0
      };
    });

    // Calculate who paid what
    expenses.forEach(expense => {
      const paidBy = expense.paidBy._id;
      const participants = expense.participants || [paidBy];
      const amountPerPerson = expense.amount / participants.length;

      // Add to what this person paid
      balances[paidBy].paid += expense.amount;

      // Calculate what each participant owes
      participants.forEach(participantId => {
        if (balances[participantId]) {
          balances[participantId].owed += amountPerPerson;
        }
      });
    });

    // Calculate final balance for each person
    Object.keys(balances).forEach(key => {
      balances[key].balance = balances[key].paid - balances[key].owed;
    });

    return balances;
  };

  const balances = calculateBalances();
  const balanceArray = Object.entries(balances).map(([id, data]) => ({
    id,
    ...data
  }));

  if (tripLoading) {
    return <div className="text-center py-8">Loading trip...</div>;
  }

  if (!currentTrip) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Trip not found</p>
        <button
          onClick={() => navigate('/trips')}
          className="text-emerald-600 hover:text-emerald-700"
        >
          Back to Trips
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/trips')}
        className="mb-4 text-gray-600 hover:text-gray-800"
      >
        ← Back to Trips
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{currentTrip.name}</h1>
        {currentTrip.description && (
          <p className="text-gray-600 mb-4">{currentTrip.description}</p>
        )}
        <div className="text-sm text-gray-500">
          {currentTrip.startDate && (
            <span className="mr-4">
              Start: {new Date(currentTrip.startDate).toLocaleDateString()}
            </span>
          )}
          {currentTrip.endDate && (
            <span>
              End: {new Date(currentTrip.endDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expenses Section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Expenses</h2>
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
            >
              + Add Expense
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {expenseLoading ? (
            <div className="text-center py-8">Loading expenses...</div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-600 text-lg mb-4">No expenses yet</p>
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Add your first expense
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">
                        {expense.description}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Paid by: {expense.paidBy?.username || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {expense.participants?.length || 0} participant
                        {(expense.participants?.length || 0) !== 1 && 's'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">
                        {expense.currency} {expense.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Balances Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Who Owes Who</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            {balanceArray.length === 0 ? (
              <p className="text-gray-600">No balance data available</p>
            ) : (
              <div className="space-y-4">
                {balanceArray.map((person) => (
                  <div
                    key={person.id}
                    className={`p-4 rounded-lg ${
                      person.balance > 0
                        ? 'bg-emerald-50 border-l-4 border-emerald-500'
                        : person.balance < 0
                        ? 'bg-red-50 border-l-4 border-red-500'
                        : 'bg-gray-50 border-l-4 border-gray-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-800">
                        {person.name}
                      </span>
                      <span
                        className={`font-bold ${
                          person.balance > 0
                            ? 'text-emerald-600'
                            : person.balance < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {person.balance > 0
                          ? `+${person.balance.toFixed(2)}`
                          : person.balance < 0
                          ? person.balance.toFixed(2)
                          : '0.00'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Paid: {person.paid.toFixed(2)} | Owed: {person.owed.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Lunch at restaurant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={newExpense.currency}
                  onChange={(e) => setNewExpense({ ...newExpense, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                  {currentTrip?.members?.map((member) => (
                    <div key={member._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`member-${member._id}`}
                        checked={newExpense.participants.includes(member._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewExpense({
                              ...newExpense,
                              participants: [...newExpense.participants, member._id],
                            });
                          } else {
                            setNewExpense({
                              ...newExpense,
                              participants: newExpense.participants.filter(
                                (id) => id !== member._id
                              ),
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`member-${member._id}`} className="text-sm">
                        {member.username}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select participants (defaults to self if none selected)
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetail;
