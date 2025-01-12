import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";



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
    try{
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
    try{
        const response = await axios.delete(`${API_URL}/api/expenses/${id}`, {
            headers: {
                'Authorization' : `Bearer ${token}`
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

    if (!isSignedIn) {
        return(<Link to="/sign-in">Please sign in to view the dashboard.</Link>);
    }
    return (
        <div>
            <h1>Dashboard</h1>
            <div className = "form-container">
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key = {expense._id}>
                                <td><input
                                    type="text"
                                    value={expense.description}
                                    onChange={(e) => {
                                        const updatedExpenses = expenses.map(exp => 
                                            exp._id === expense._id 
                                                ? {...exp, description: e.target.value}
                                                : exp
                                        );
                                        setExpenses(updatedExpenses);
                                    }}
                                />
                                </td>
                                <td><input
                                    type="number"
                                    value={expense.amount}
                                    onChange={(e) => {
                                        const updatedExpenses = expenses.map(exp => 
                                            exp._id === expense._id ? {...exp, amount: e.target.value} : exp
                                        );
                                        setExpenses(updatedExpenses);
                                    }}
                                />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={expense.date}
                                        onChange={(e) => {
                                            const updatedExpenses = expenses.map(exp => 
                                                exp._id === expense._id ? {...exp, date: e.target.value} : exp
                                            );
                                            setExpenses(updatedExpenses);
                                        }}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={expense.category}
                                        onChange={(e) => {
                                            const updatedExpenses = expenses.map(exp => 
                                                exp._id === expense._id ? {...exp, category: e.target.value} : exp
                                            );
                                            setExpenses(updatedExpenses);
                                        }}
                                    >
                                        <option value = "">Select a category</option>
                                        <option value = "Food">Food</option>
                                        <option value = "Transport">Transport</option>
                                        <option value = "Entertainment">Entertainment</option>
                                        <option value = "Other">Other</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick = { () => handleDelete(expense._id)}>Delete</button>
                                    <button onClick = { () => handleUpdate(expense)}>Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <form onSubmit={handleSubmit}>
                <input 
                type = "text" 
                placeholder = "Description" 
                value = {newExpense.description} 
                onChange = {(e) => setNewExpense({...newExpense, description: e.target.value})} 
                required/>
                <input 
                type = "number" 
                placeholder = "Amount" 
                value = {newExpense.amount} 
                onChange = {(e) => setNewExpense({...newExpense, amount: e.target.value})} 
                required/>
                <input 
                type = "date" 
                value = {newExpense.date} 
                onChange = {(e) => setNewExpense({...newExpense, date: e.target.value})} 
                required/>
                <select
                    value = {newExpense.category}
                    onChange = {(e) => setNewExpense({...newExpense, category: e.target.value})}
                    required >
                    <option value = "">Select a category</option>
                    <option value = "Food">Food</option>
                    <option value = "Transport">Transport</option>
                    <option value = "Entertainment">Entertainment</option>
                    <option value = "Other">Other</option>
                </select>
                <button type = "submit">Add Expense</button>
                <button onClick = {() => handleUpdate(expense)}>Update</button>
            </form>
        </div>
    )
}

export default Dashboard;