import React, {useState, useEffect} from 'react'
import {View, Text, ActivityIndicator} from 'react-native';
import {BudgetResponse} from "../../../utils/dataTypes";
import {auth} from "../../../utils/firebaseConfig";
import {getBudgets} from "../api/budgetingApi";

interface BudgetsProps {
    period: string;
}

const Budgets: React.FC<BudgetsProps> = ({period}) => {
    const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBudgets = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("No user found.");
                return;
            }
            const token = await user.getIdToken();
            const budgetsByPeriod = await getBudgets(token, period);
            setBudgets(budgetsByPeriod);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        }
    }

    useEffect(() => {
        fetchBudgets();
    }, [period]);

    return(
        <View style={{padding: 10}}>
            {loading ? (
                <ActivityIndicator size="small" color="#1565c0" />
            ) : budgets.length > 0 ? (
                budgets.map((budget, index) => (
                    <Text key={index} style={{ fontSize: 13, paddingVertical: 5}}>
                        {budget.categoryId} €{budget.currentAmount} of {budget.amountLimit}
                    </Text>
                ))
            ) : (
                <Text>No budgets found.</Text>
            )}
        </View>
    );
};

export default Budgets;
