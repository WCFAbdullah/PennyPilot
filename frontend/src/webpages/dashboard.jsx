import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { PlusIcon, TrashIcon, PencilIcon, ChartBarIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/20/solid';
import { useUser } from '@clerk/clerk-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const dateInputStyle = {
    colorScheme: 'dark',  
    color: 'white',
    backgroundColor: 'transparent',
    border: '1px solid #4a5568',  
    borderRadius: '0.375rem',  
    padding: '0.5rem',
    cursor: 'pointer'
};

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
  const message = `${greeting}, ${user.firstName}`;
  return (
      <h1 className = "text-4xl font-bold text-white mb-8 text-center">{message}</h1>
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

    const prepareLineChartData = () => {
        if (!expenses || expenses.length === 0) {
            return {
                labels: [],
                datasets: [{
                    label: 'Expenses',
                    data: [],
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    tension: 0.4
                }]
            };
        }
    
        const sortedExpenses = [...expenses]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(exp => ({
                ...exp,
                amount: Number(exp.amount) || 0,
                date: new Date(exp.date).toLocaleDateString()
            }));
    
        return {
            labels: sortedExpenses.map(exp => exp.date),
            datasets: [{
                label: 'Expenses',
                data: sortedExpenses.map(exp => exp.amount),
                borderColor: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: 'rgba(255, 255, 255, 0.8)',
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#fff',
                pointBorderWidth: 2,
                borderWidth: 2,
            }]
        };
    };

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
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
                <Link to="/sign-in" className="px-6 py-3 text-indigo-100 bg-indigo-600 rounded-full hover:bg-indigo-500 transition duration-300 shadow-lg hover:shadow-indigo-500/30">
                    Please sign in
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <TimeBasedGreeting />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="flex flex-col justify-center space-y-5">
                        <div className="bg-gray-900/50 backdrop-blur rounded-xl shadow-lg p-6 flex items-center space-x-4 border border-indigo-500/20">
                            <div className="p-3 bg-indigo-400/20 rounded-full">
                                <CurrencyDollarIcon className="h-8 w-8 text-indigo-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-indigo-300">Total Expenses</p>
                                <p className="text-2xl font-semibold text-indigo-100">${calculateTotalExpenses()}</p>
                            </div>
                        </div>
                        <div className="bg-gray-900/50 backdrop-blur rounded-xl shadow-lg p-6 flex items-center space-x-4 border border-indigo-500/20">
                            <div className="p-3 bg-indigo-400/20 rounded-full">
                                <ChartBarIcon className="h-8 w-8 text-indigo-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-indigo-300">Number of Expenses</p>
                                <p className="text-2xl font-semibold text-indigo-100">{expenses.length}</p>
                            </div>
                        </div>
                        <div className="bg-gray-900/50 backdrop-blur rounded-xl shadow-lg p-6 flex items-center space-x-4 border border-indigo-500/20">
                            <div className="p-3 bg-indigo-400/20 rounded-full">
                                <CalendarIcon className="h-8 w-8 text-indigo-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-indigo-300">Last Updated</p>
                                <p className="text-2xl font-semibold text-indigo-100">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 p-6 shadow-xl text-center w-full">
                            <h2 className="text-xl font-semibold text-white/90 mb-4">Expense Timeline</h2>
                            {expenses.length > 0 ? (
                                <Line 
                                    data={prepareLineChartData()}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        plugins: {
                                            legend: {
                                                display: false // Hide legend since we have a title
                                            },
                                            tooltip: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                titleColor: '#fff',
                                                bodyColor: '#fff',
                                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                                borderWidth: 1,
                                                padding: 12,
                                                displayColors: false,
                                                callbacks: {
                                                    label: function(context) {
                                                        return `$${context.parsed.y.toFixed(2)}`;
                                                    }
                                                }
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.1)',
                                                    drawBorder: false,
                                                },
                                                ticks: {
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                    padding: 10,
                                                    callback: function(value) {
                                                        return '$' + value;
                                                    }
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    display: false, // Hide x grid lines for cleaner look
                                                },
                                                ticks: {
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                    padding: 10,
                                                    maxRotation: 45,
                                                    minRotation: 45
                                                }
                                            }
                                        },
                                        interaction: {
                                            intersect: false,
                                            mode: 'index'
                                        }
                                    }}
                                />
                            ) : (
                                <p className="text-white/70">No expenses found</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur shadow-lg rounded-xl overflow-hidden mb-8 border border-indigo-500/20">
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-indigo-100">Expense List</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-indigo-500/20">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-indigo-500/20">
                                {[...expenses]
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))  // Sort by date, newest first
                                    .map((expense) => (
                                        <tr key={expense._id} className="hover:bg-indigo-500/10 transition duration-150">
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
                                                    className="w-full px-2 py-1 rounded bg-gray-900/50 text-indigo-100 border border-indigo-500/30 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20 transition duration-150"
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
                                                    className="w-full px-2 py-1 rounded bg-gray-900/50 text-indigo-100 border border-indigo-500/30 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20 transition duration-150"
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
                                                    style={dateInputStyle}
                                                    className="[color-scheme:dark]px-2 py-1 rounded bg-gray-900/50 text-indigo-100 border border-indigo-500/30 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20 transition duration-150"
                                                    
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
                                                    className="w-full px-2 py-1 rounded bg-gray-900/50 text-indigo-100 border border-indigo-500/30 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20 transition duration-150"
                                                >
                                                    <option value="">Select a category</option>
                                                    <option value="Food">Food</option>
                                                    <option value="Transport">Transport</option>
                                                    <option value="Entertainment">Entertainment</option>
                                                    <option value="Utilities">Utilities</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleDelete(expense._id)} className="text-rose-400 hover:text-rose-300 mr-2 transition duration-150">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleUpdate(expense)} className="text-indigo-400 hover:text-indigo-300 transition duration-150">
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur shadow-lg rounded-xl p-6 border border-indigo-500/20 mb-16">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-100">Add New Expense</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-indigo-300">Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    placeholder="Description"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border border-indigo-500/30 rounded-md shadow-sm text-indigo-100 placeholder-indigo-500/50 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20"
                                />
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-indigo-300">Amount</label>
                                <input
                                    id="amount"
                                    type="number"
                                    placeholder="Amount"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border border-indigo-500/30 rounded-md shadow-sm text-indigo-100 placeholder-indigo-500/50 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20"
                                />
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-indigo-300">Date</label>
                                <input
                                    id="date"
                                    type="date"
                                    value={newExpense.date}
                                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border border-indigo-500/30 rounded-md shadow-sm text-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20"
                                    style={dateInputStyle}
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-indigo-300">Category</label>
                                <select
                                    id="category"
                                    value={newExpense.category}
                                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border border-indigo-500/30 rounded-md shadow-sm text-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20"
                                >
                                    <option value="">Select a category</option>
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Add Expense
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;