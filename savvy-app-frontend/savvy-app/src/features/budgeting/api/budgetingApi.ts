import axios from 'axios';
import API_URL from '../../../utils/apiConfig';
import {BudgetRequest, BudgetResponse} from "../../../utils/dataTypes";

const BUDGETING_API = `${API_URL}/api/budgeting`;

export const addBudget = async (token: string, request: BudgetRequest) => {
    try {
        console.log("Token being sent:", `Bearer ${token}`);
        console.log("Request body being sent:", request);
        const response = await axios.post(`${BUDGETING_API}/add`, request,{
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
    }
};

export const getBudgets = async (token: string, period: string) => {
    try {
        console.log("Token being sent:", `Bearer ${token}`);
        const response = await axios.get<BudgetResponse[]>(`${BUDGETING_API}/budgets`, {
            params: {period},
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting budgets:", error);
        throw error;
    }
}
