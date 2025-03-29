import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Transactions: NavigatorScreenParams<TransactionStackParamList>;
    Budgeting: NavigatorScreenParams<BudgetingStackParamList>
};

export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
};

export type TransactionStackParamList = {
    AddMoney: undefined;
    AddExpense: undefined;
};

export type BudgetingStackParamList = {
    AddBudget: undefined;
}

export type AuthScreenProps<T extends keyof AuthStackParamList> =
    NativeStackScreenProps<AuthStackParamList, T>;

export type TransactionScreenProps<T extends keyof TransactionStackParamList> =
    NativeStackScreenProps<TransactionStackParamList, T>;

export type BudgetingScreenProps<T extends keyof BudgetingStackParamList> =
    NativeStackScreenProps<BudgetingStackParamList, T>;
