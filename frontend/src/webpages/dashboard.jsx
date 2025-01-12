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

export const createExpense = async (expense) => {
    try{
        const response = await axios.post(`${API_URL}/api/expenses`, expense);
        return response.data;
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
}

export const updateExpense = async (id, expense) => {
    try{
        const response = await axios.put(`${API_URL}/api/expenses/${id}`, expense);
        return response.data;
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
}

export const deleteExpense = async (id) => {
    try{
        const response = await axios.delete(`${API_URL}/api/expenses/${id}`)
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

    if (!isSignedIn) {
        return(<Link to="/sign-in">Please sign in to view the dashboard.</Link>);
    }
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard;