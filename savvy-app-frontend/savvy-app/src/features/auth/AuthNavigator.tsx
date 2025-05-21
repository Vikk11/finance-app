import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/home/HomeScreen";
import PaymentRequestsPage from "./screens/payments/PaymentRequestsPage";
import CreatePaymentRequest from "./screens/payments/CreatePaymentRequest";
import PaymentsScreen from "./screens/payments/PaymentsScreen";
import SendMoney from "./screens/payments/SendMoney";
import AddGroupScreen from "./screens/groups/AddGroupScreen";
import GroupScreen from "./screens/groups/GroupScreen";
import { AuthStackParamList } from "../../utils/types";
import RequestDetailsScreen from "./screens/payments/RequestDetailsScreen";
import SettingsScreen from "./screens/settings/SettingsScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Signup" component={SignupScreen} />
            <AuthStack.Screen name="Home" component={HomeScreen} />
            <AuthStack.Screen name="PaymentRequests" component={PaymentRequestsPage} />
            <AuthStack.Screen name="CreatePaymentRequest" component={CreatePaymentRequest} />
            <AuthStack.Screen name="Payments" component={PaymentsScreen} />
            <AuthStack.Screen name="SendMoney" component={SendMoney} />
            <AuthStack.Screen name="AddGroup" component={AddGroupScreen} />
            <AuthStack.Screen name="Groups" component={GroupScreen} />
            <AuthStack.Screen name="RequestDetails" component={RequestDetailsScreen} />
            <AuthStack.Screen name="Settings" component={SettingsScreen} />
        </AuthStack.Navigator>
    );
};

export default AuthNavigator;
