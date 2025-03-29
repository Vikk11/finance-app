import {auth} from "./firebaseConfig";
import {getCategories} from "../features/transactions/api/transactionApi";

export const fetchCategories= async () => {
    try {
        const user = auth.currentUser;
        if(!user){
            console.error("No user found.")
            return null;
        }
        const token = await user.getIdToken();
        if(!token) return;
        return await getCategories(token);
    } catch (error) {
        console.error("Error fetching categories: ", error);
    }
}
