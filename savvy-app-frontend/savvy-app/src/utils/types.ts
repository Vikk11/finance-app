import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Auth: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
    NativeStackScreenProps<AuthStackParamList, T>;

export type AppStackParamList = RootStackParamList & AuthStackParamList;
