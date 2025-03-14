import axios from 'axios';
import API_URL from '../../../utils/apiConfig';

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
