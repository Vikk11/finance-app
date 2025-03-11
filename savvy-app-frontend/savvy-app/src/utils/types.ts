import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Transactions: NavigatorScreenParams<TransactionStackParamList>;
};

export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
};

export type TransactionStackParamList = {
    AddMoney: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
    NativeStackScreenProps<AuthStackParamList, T>;

export type TransactionScreenProps<T extends keyof TransactionStackParamList> =
    NativeStackScreenProps<TransactionStackParamList, T>;

