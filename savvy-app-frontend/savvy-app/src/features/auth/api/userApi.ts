import axios from 'axios';
import API_URL from '../../../utils/apiConfig';
import { UserRequest } from "../../../utils/dataTypes";

const USER_API = `${API_URL}/api/users`;

export const getUserBalance = async (token: string) => {
    try {
        console.log("Token being sent:", `Bearer ${token}`);
        const response = await axios.get(`${USER_API}/getBalance`,{
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting balance:", error);
        throw error;
    }
};

export const addUser = async (token: string, request: UserRequest) => {
    try {
        console.log("Token being sent:", `Bearer ${token}`);
        console.log("Request body being sent:", request);
        const response = await axios.post(`${USER_API}/add`, request,{
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
