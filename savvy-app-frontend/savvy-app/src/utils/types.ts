import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorScreenParams } from '@react-navigation/native';
import {PaymentRequest} from "./dataTypes";

export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Transactions: NavigatorScreenParams<TransactionStackParamList>;
    Budgeting: NavigatorScreenParams<BudgetingStackParamList>
};

export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
    PaymentRequests: undefined;
    CreatePaymentRequest: undefined;
    Payments: undefined;
    SendMoney: undefined;
    AddGroup: undefined;
    Groups: undefined;
    RequestDetails: {
        request: PaymentRequest,
        status: "ALL" | "PAID" | "PENDING" | "DECLINED" };
    Settings: undefined;
};

export type TransactionStackParamList = {
    AddMoney: undefined;
    AddExpense: undefined;
    AllTransactions: undefined;
};

export type BudgetingStackParamList = {
    AddBudget: undefined;
    BudgetsScreen: undefined;
}

export type AuthScreenProps<T extends keyof AuthStackParamList> =
    NativeStackScreenProps<AuthStackParamList, T>;

export type TransactionScreenProps<T extends keyof TransactionStackParamList> =
    NativeStackScreenProps<TransactionStackParamList, T>;

export type BudgetingScreenProps<T extends keyof BudgetingStackParamList> =
    NativeStackScreenProps<BudgetingStackParamList, T>;
