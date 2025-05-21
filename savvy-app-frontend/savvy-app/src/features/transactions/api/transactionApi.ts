import axios from 'axios';
import API_URL from '../../../utils/apiConfig';
import {TransactionRequest, TransactionResponse} from "../../../utils/dataTypes";
import * as assert from "node:assert";

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

export const getCategories = async (token: string) => {
    try {
        console.log("Token being sent:", `Bearer ${token}`);
        const response = await axios.get(`${TRANSACTION_API}/categories`,{
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

export const getRecentTransactions = async (token: string) => {
    try {
        console.log("Token being sent:", `Bearer ${token}`);
        const response = await axios.get<TransactionResponse[]>(`${TRANSACTION_API}/recentTransactions`,{
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting transactions:", error);
        throw error;
    }
}

export const getAllTransactions = async (token: string) => {
    try {
        console.log("Token being sent:", `Bearer ${token}`);
        const response = await axios.get<TransactionResponse[]>(`${TRANSACTION_API}/allTransactions`,{
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting transactions:", error);
        throw error;
    }
}

export const fetchTransactionsPage = async (
    page: number,
    size: number,
    token: string
): Promise<TransactionResponse[]> => {
    try {
        console.log("Token being sent:", `Bearer ${token}`);
        const response = await axios.get<TransactionResponse[]>(`${TRANSACTION_API}/?page=${page}&size=${size}`,{
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting transactions:", error);
        throw error;
    }
};
