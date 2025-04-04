import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from "../features/auth/AuthNavigator";
import TransactionsNavigator from "../features/transactions/TransactionsNavigator";
import { RootStackParamList } from "../utils/types";
import BudgetingNavigator from "../features/budgeting/BudgetingNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Auth" component={AuthNavigator} />
                <Stack.Screen name="Transactions" component={TransactionsNavigator} />
                <Stack.Screen name="Budgeting" component={BudgetingNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
