import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddMoneyScreen from "./screens/income/AddMoneyScreen";
import { TransactionStackParamList } from "../../utils/types";

const TransactionsStack = createNativeStackNavigator<TransactionStackParamList>();

const TransactionsNavigator = () => {
    return (
        <TransactionsStack.Navigator>
            <TransactionsStack.Screen name="AddMoney" component={AddMoneyScreen} />
        </TransactionsStack.Navigator>
    );
};

export default TransactionsNavigator;
