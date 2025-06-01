import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import BottomNav from '../../../../components/BottomNav';
import styles from './style';
import AddIcon from "../../../../../assets/icons/add-icon.svg";
import RequestIcon from "../../../../../assets/icons/money-request-icon.svg";
import ExpenseIcon from "../../../../../assets/icons/expense-icon.svg";
import BudgetIcon from "../../../../../assets/icons/budget-icon.svg";
import components from '../../../../styles/components';
import DefaultIcon from "../../../../../assets/icons/default-profile-icon.svg"
import {RootStackParamList} from "../../../../utils/types";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useNavigation, useFocusEffect} from "@react-navigation/native";
import {auth, db} from "../../../../utils/firebaseConfig";
import {doc, getDoc} from "firebase/firestore";
import { getUserBalance } from "../../api/userApi";
import {getRecentTransactions} from "../../../transactions/api/transactionApi";
import {TransactionResponse} from "../../../../utils/dataTypes";
import AddMoneyIcon from "../../../../../assets/transaction-icons/added-money.svg"
import ReceiveMoneyIcon from "../../../../../assets/transaction-icons/receive-money.svg";
import SendMoneyIcon from "../../../../../assets/transaction-icons/send-money.svg";
import {categoryIcons} from "../../../transactions/utils/categoryIcons";
import {fetchCategories} from "../../../../utils/functions";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
    const [balance, setBalance] = useState("");
    const [name, setName] = useState("");
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const navigation = useNavigation<NavigationProp>();

    const goToPage = (page: keyof RootStackParamList, params?: object) => {
        navigation.navigate(page as any, params);
    };

    const fetchUserName = async () => {
        const user = auth.currentUser;
        if(user) {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setName(userDoc.data().name || "John Doe");
                } else {
                    console.log("User document not found");
                }
            } catch (error) {
                console.error("Error fetching user name:", error);
            }
        }
    };

    const fetchBalance = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("No user found.");
                return;
            }

            const token = await user.getIdToken();
            const balance = await getUserBalance(token);
            setBalance(balance);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    const fetchRecentTransactions = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("No user found.");
                return;
            }

            const token = await user.getIdToken();
            const recentTransactions = await getRecentTransactions(token);
            setTransactions(recentTransactions);
        } catch (error) {
            console.error("Error fetching recent transactions:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    const getTransactionIcon = (transaction: TransactionResponse) => {
        if (transaction.relatedUserId) {
            return transaction.type === "INCOME" ? <ReceiveMoneyIcon width={35} height={35}/> : <SendMoneyIcon width={35} height={35}/>;
        }

        if(transaction.type === "INCOME"){
            return <AddMoneyIcon width={35} height={35}/>;
        }

        if (!transaction.categoryId){
            return;
        }
        const IconComponent = categoryIcons[transaction.categoryId] || DefaultIcon;
        return <IconComponent width={35} height={35} />;
    };

    const getCategoryName = (categoryId: number) => {
        if (!categoryId) return "Added Money";

        const category = categories.find(cat => Number(cat.id) === categoryId);
        return category ? category.name : "Unknown Category";
    };

    useEffect(() => {
        fetchUserName();
        fetchBalance();
        fetchRecentTransactions();
        const loadCategories = async () => {
            const data = await fetchCategories();
            if (data) setCategories(data);
        };
        loadCategories();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchBalance();
            fetchRecentTransactions()
            const loadCategories = async () => {
                const data = await fetchCategories();
                if (data) setCategories(data);
            };
            loadCategories();
        }, [])
    );

    return (
        <View style={{flex:1}}>
            <View style={styles.homeContainer}>
                <View style = {styles.container}>
                    <Text style = {styles.welcomeText}>Welcome back{"\n"}
                        <Text style={styles.nameText}>{name}</Text>
                    </Text>
                    <DefaultIcon width={70} height={70} style={{marginRight:10}}/>
                </View>
                <View style={components.container}>
                    <Text>Balance</Text>
                    <Text style = {components.moneyText}>€{balance}</Text>
                </View>
                <View style={styles.container}>
                    <View style = {{flexDirection: "column"}}>
                        <TouchableOpacity style={styles.buttons} onPress={() => goToPage("Transactions", { screen: "AddMoney" })}>
                            <AddIcon width={40} height={40} />
                        </TouchableOpacity>
                        <Text style={styles.text}>Top up</Text>
                    </View>

                    <View style= {{flexDirection:'column'}}>
                        <TouchableOpacity style={styles.buttons} onPress={() => goToPage("Auth", { screen: "PaymentRequests" })}>
                            <RequestIcon width={40} height={40} />
                        </TouchableOpacity>
                        <Text style={styles.text}>Requests</Text>
                    </View>

                    <View style={{flexDirection:'column'}}>
                        <TouchableOpacity style={styles.buttons} onPress={() => goToPage("Transactions", { screen: "AddExpense" })}>
                            <ExpenseIcon width={40} height={40} />
                        </TouchableOpacity>
                        <Text style={styles.text}>Add Expense</Text>
                    </View>

                    <View style={{flexDirection:'column'}}>
                        <TouchableOpacity style={styles.buttons} onPress={() => goToPage("Budgeting", { screen: "BudgetsScreen" })}>
                            <BudgetIcon width={40} height={40} />
                        </TouchableOpacity>
                        <Text style={styles.text}>Budgets</Text>
                    </View>
                </View>
                <Text>Recent Transactions</Text>
                <View style={styles.container}>
                    <FlatList
                        data={transactions}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.transactionRow}>
                                <View style={styles.iconContainer}>{getTransactionIcon(item)}</View>
                                <View style={styles.transactionDetails}>
                                    <Text style={styles.transactionName}>
                                        {item.name || getCategoryName(item.categoryId) || "Added money"}
                                    </Text>
                                    <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
                                </View>
                                <Text style={styles.paymentType}>{item.categoryId === 15 ? "⎯" : "Payment"}</Text>
                                <Text style={styles.transactionAmount}>
                                    {item.type === "INCOME" ? "+" : "-"}€{item.amount.toFixed(2)}
                                </Text>
                            </View>
                        )}
                    />
                </View>
                <TouchableOpacity style={components.button} onPress={() => goToPage("Transactions", { screen: "AllTransactions" })}>
                    <Text style={components.buttonText}>See all</Text>
                </TouchableOpacity>
                <View style={styles.container}>
                    <View style={components.container}>
                        <Text>Spent this month</Text>
                    </View>
                    <View style={components.container}>
                        <Text>Savings goal</Text>
                    </View>
                </View>
            </View>
            <BottomNav />
        </View>
    );
};

export default HomeScreen;
