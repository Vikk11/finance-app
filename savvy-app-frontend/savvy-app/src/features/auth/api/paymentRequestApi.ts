import axios from 'axios';
import API_URL from '../../../utils/apiConfig';

const PAYMENT_REQUEST_API = `${API_URL}/api/payment_requests`;

export const getAllRequests = async (token: string) => {
    try {
        console.log("Token being sent:", `Bearer ${token}`);
        const response = await axios.get(`${PAYMENT_REQUEST_API}/allRequests`,{
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

export const handleRequest = async (id: number, status: string, token: string) => {
    try {
        await axios.put(`${PAYMENT_REQUEST_API}/${id}/status`, null, {
            params: {status},
            headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
    } catch (error) {
        console.error("Update failed:", error);
        throw error;
    }
};

