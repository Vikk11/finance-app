import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {BudgetResponse, TransactionResponse} from "../../../utils/dataTypes";
import {auth} from "../../../utils/firebaseConfig";
import {getBudgets} from "../api/budgetingApi";
import {fetchCategories} from "../../../utils/functions";
import {getAllTransactions} from "../../transactions/api/transactionApi";
import {categoryIcons} from "../../transactions/utils/categoryIcons";
import styles from "./style"

interface BudgetsProps {
    period: string;
}

const Budgets: React.FC<BudgetsProps> = ({ period }) => {
    const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;
                const token = await user.getIdToken();
                const [budgetsByPeriod, allTransactions, categoryData] = await Promise.all([
                    getBudgets(token, period),
                    getAllTransactions(token),
                    fetchCategories()
                ]);
                setBudgets(budgetsByPeriod);
                setTransactions(allTransactions);
                if (categoryData) setCategories(categoryData);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [period]);

    const getCategoryName = useCallback((categoryId: number) => {
        if (!categoryId) return "Nothing";
        const category = categories.find(cat => Number(cat.id) === categoryId);
        return category ? category.name : "Unknown Category";
    }, [categories]);


    const getTransactionCount = useCallback((categoryId: number) => {
        return transactions.filter(tx => tx.categoryId === categoryId).length;
    }, [transactions]);

    const getCategoryIcon = useCallback((categoryId: number) => {
        const IconComponent = categoryIcons[categoryId];
        return IconComponent ? <IconComponent width={30} height={30} /> : <Text>?</Text>;
    }, []);

    const toggleCategory = (categoryId: number) => {
        setSelectedCategoryId(prev => prev === categoryId ? null : categoryId);
    };

    const getStartAndEndDates = (period: string) => {
        const now = new Date();
        let start: Date, end: Date;

        if (period === "weekly") {
            const day = now.getDay();
            start = new Date(now);
            start.setDate(now.getDate() - day);
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
        } else if (period === "monthly") {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        } else {
            start = new Date("2000-01-01");
            end = new Date("2100-01-01");
        }

        return { start, end };
    };

    const filterTransactions = useCallback((categoryId: number) => {
        const { start, end } = getStartAndEndDates(period);
        return transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return tx.categoryId === categoryId && txDate >= start && txDate <= end;
        });
    }, [transactions, period]);

    const getProgressBarColor = (percent: number) => {
        if (percent <= 0.5) return "#4caf50";
        if (percent <= 0.85) return "#e18b22";
        return "#f44336";
    };

    return (
        <View style={{ padding: 10 }}>
            {loading ? (
                <ActivityIndicator size="small" color="#1565c0" />
            ) : budgets.length > 0 ? (
                budgets.map((budget) => (
                    <View key={budget.categoryId}>
                        <TouchableOpacity onPress={() => toggleCategory(budget.categoryId)}>
                            <View style={styles.budgetRow}>
                                <View style={styles.leftSide}>
                                    <View style={styles.iconCircle}>
                                        {getCategoryIcon(budget.categoryId)}
                                    </View>
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.categoryName}>{getCategoryName(budget.categoryId)}</Text>
                                        <Text style={styles.transactionCount}>
                                            {getTransactionCount(budget.categoryId)} transactions
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.amountText}>
                                    €{budget.currentAmount.toFixed(2)} of €{budget.amountLimit.toFixed(2)}
                                </Text>
                            </View>

                            <View style={styles.progressBarContainer}>
                                <View
                                    style={{
                                        ...styles.progressFill,
                                        width: `${Math.min((budget.currentAmount / budget.amountLimit) * 100, 100)}%`,
                                        backgroundColor: getProgressBarColor(budget.currentAmount / budget.amountLimit),
                                    }}
                                />
                            </View>
                        </TouchableOpacity>

                        {selectedCategoryId === budget.categoryId && (
                            <View style={styles.transactionList}>
                                {filterTransactions(budget.categoryId).length > 0 ? (
                                    filterTransactions(budget.categoryId).map(tx => (
                                        <View key={tx.id} style={styles.transactionItem}>
                                            <Text style={styles.transactionName}>{tx.name || getCategoryName(tx.categoryId)}</Text>
                                            <Text style={styles.transactionDate}>{new Date(tx.date).toLocaleDateString()}</Text>
                                            <Text style={styles.transactionAmount}>-€{tx.amount.toFixed(2)}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noTransactionsText}>No transactions for this category.</Text>
                                )}
                            </View>
                        )}

                        <View style={styles.divider} />
                    </View>
                ))
            ) : (
                <Text>No budgets found.</Text>
            )}
        </View>
    );
};

export default Budgets;
