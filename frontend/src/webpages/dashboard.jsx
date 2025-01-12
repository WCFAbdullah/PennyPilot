import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { PlusIcon, TrashIcon, PencilIcon, ChartBarIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/20/solid';
import { useUser } from '@clerk/clerk-react';

const TimeBasedGreeting = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return 'Good Morning';
      } else if (currentHour < 18) {
        return 'Good Afternoon';
      } else {
        return 'Good Evening';
      }
    };

    setGreeting(getGreeting());
  }, []); 
  
  const { user } = useUser();
  const message = `${greeting}, ${user.firstName}!`;
  return (
      <h1 className = "text-4xl font-bold text-gray-900 mb-8 text-center">{message}</h1>
  );
};


const API_URL = "http://localhost:3000";

export const getExpense = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/expenses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
};

export const createExpense = async (token, expense) => {
    try {
        const response = await axios.post(`${API_URL}/api/expenses`, {
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            category: expense.category
        },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
}

export const updateExpense = async (token, id, expense) => {
    try {
        const response = await axios.put(
            `${API_URL}/api/expenses/${id}`,
            {
                description: expense.description,
                amount: expense.amount,
                date: expense.date,
                category: expense.category
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating expense:", error);
        throw error;
    }
};

export const deleteExpense = async (token, id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/expenses/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
}


function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const { isSignedIn } = useAuth();
    const { getToken } = useAuth();
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        date: '',
        category: ''
    });

    
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = await getToken();
                const data = await getExpense(token);
                setExpenses(data);

            } catch (error) {
                console.error("Failed to fetch expenses:", error);
            }
        };

        if (isSignedIn) {  // Only fetch if user is signed in
            fetchExpenses();
        }
    }, [isSignedIn, getToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            await createExpense(token, newExpense);
            const updatedExpenses = await getExpense(token);
            setExpenses(updatedExpenses);
            setNewExpense({
                description: '',
                amount: '',
                date: '',
                category: ''
            });
        } catch (error) {
            console.error("Failed to create expense:", error);
        }

    }

    const handleDelete = async (id) => {
        try {
            const token = await getToken();
            await deleteExpense(token, id);
            const updatedExpenses = await getExpense(token);
            setExpenses(updatedExpenses);
        } catch (error) {
            console.error("Failed to delete expense:", error);
        }
    }

    const handleUpdate = async (expense) => {
        try {
            const token = await getToken();
            await updateExpense(token, expense._id, expense);
            const updatedExpenses = await getExpense(token);
            setExpenses(updatedExpenses);
        } catch (error) {
            console.error("Failed to update expense:", error);
        }
    }

    const calculateTotalExpenses = () => {
        return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);
    }

    if (!isSignedIn) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-teal-100">
                <Link to="/sign-in" className="px-6 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Please sign in to view the dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <TimeBasedGreeting />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                            <p className="text-2xl font-semibold text-gray-900">${calculateTotalExpenses()}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-full">
                            <ChartBarIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Number of Expenses</p>
                            <p className="text-2xl font-semibold text-gray-900">{expenses.length}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <CalendarIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Last Updated</p>
                            <p className="text-2xl font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8 backdrop-filter backdrop-blur-lg bg-opacity-80">
                    <div className="p-6 ">
                        <h2 className="text-2xl font-semibold text-black">Expense List</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {expenses.map((expense) => (
                                    <tr key={expense._id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="text"
                                                value={expense.description}
                                                onChange={(e) => {
                                                    const updatedExpenses = expenses.map(exp =>
                                                        exp._id === expense._id
                                                            ? { ...exp, description: e.target.value }
                                                            : exp
                                                    );
                                                    setExpenses(updatedExpenses);
                                                }}
                                                className="w-full px-2 py-1 border rounded "
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                value={expense.amount}
                                                onChange={(e) => {
                                                    const updatedExpenses = expenses.map(exp =>
                                                        exp._id === expense._id ? { ...exp, amount: e.target.value } : exp
                                                    );
                                                    setExpenses(updatedExpenses);
                                                }}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="date"
                                                value={expense.date ? new Date(expense.date).toISOString().split('T')[0] : ''}
                                                onChange={(e) => {
                                                    const updatedExpenses = expenses.map(exp =>
                                                        exp._id === expense._id
                                                            ? { ...exp, date: e.target.value }
                                                            : exp
                                                    );
                                                    setExpenses(updatedExpenses);
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={expense.category}
                                                onChange={(e) => {
                                                    const updatedExpenses = expenses.map(exp =>
                                                        exp._id === expense._id ? { ...exp, category: e.target.value } : exp
                                                    );
                                                    setExpenses(updatedExpenses);
                                                }}
                                                className="w-full px-2 py-1 border rounded "
                                            >
                                                <option value="">Select a category</option>
                                                <option value="Food">Food</option>
                                                <option value="Transport">Transport</option>
                                                <option value="Entertainment">Entertainment</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleDelete(expense._id)} className="text-red-600 hover:text-red-900 mr-2 transition duration-150">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleUpdate(expense)} className="text-blue-600 hover:text-blue-900 transition duration-150">
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-xl p-6 backdrop-filter backdrop-blur-lg bg-opacity-80">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">Add New Expense</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    placeholder="Description"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                                />
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    id="amount"
                                    type="number"
                                    placeholder="Amount"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                                />
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    id="date"
                                    type="date"
                                    value={newExpense.date}
                                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    id="category"
                                    value={newExpense.category}
                                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                                >
                                    <option value="">Select a category</option>
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black transition duration-150">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Add Expense
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    )
}

export default Dashboard;
