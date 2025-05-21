import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddMoneyScreen from "./screens/income/AddMoneyScreen";
import AddExpenseScreen from "./screens/expense/AddExpense";
import { TransactionStackParamList } from "../../utils/types";
import TransactionsScreen from "./screens/transactions/TransactionsScreen";

const TransactionsStack = createNativeStackNavigator<TransactionStackParamList>();

const TransactionsNavigator = () => {
    return (
        <TransactionsStack.Navigator>
            <TransactionsStack.Screen name="AddMoney" component={AddMoneyScreen} />
            <TransactionsStack.Screen name="AddExpense" component={AddExpenseScreen} />
            <TransactionsStack.Screen name="AllTransactions" component={TransactionsScreen} />
        </TransactionsStack.Navigator>
    );
};

export default TransactionsNavigator;
