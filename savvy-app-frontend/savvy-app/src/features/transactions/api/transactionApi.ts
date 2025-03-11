import axios from 'axios';
import API_URL from '../../../utils/apiConfig';
import { TransactionRequest } from "../../../utils/dataTypes";

const TRANSACTION_API = `${API_URL}/api/transactions`;

export const addTransaction = async (token: string, request: TransactionRequest) => {
    try {
        console.log("Token being sent:", `Bearer ${token}`);
        console.log("Request body being sent:", request);
        const response = await axios.post(`${TRANSACTION_API}/add`, request,{
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
