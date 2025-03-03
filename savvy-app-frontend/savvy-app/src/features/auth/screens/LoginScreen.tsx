import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from './styles';
import AppIcon from '../../../../assets/icons/app-logo.svg'
import {AuthScreenProps} from "../../../utils/types";
import GoogleLogo from "../../../../assets/icons/google_logo.svg";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential} from "firebase/auth";
import { auth } from '../../../utils/firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import Constants from "expo-constants";

const LoginScreen: React.FC<AuthScreenProps<"Login">> = ( {navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }
        setLoading(true);

        try{
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Login successful!');
            navigation.replace('Home');
        } catch (error: any){
            Alert.alert('Login failed.', error.message);
        } finally {
            setLoading(false);
        }
    };

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: Constants.expoConfig?.extra?.FIREBASE_WEB_CLIENT_ID,
    });

    useEffect(() => {
        const handleGoogleLogin = async () => {
            try {
                if (response?.type === "success") {
                    const { id_token } = response.params;
                    const googleCredential = GoogleAuthProvider.credential(id_token);
                    await signInWithCredential(auth, googleCredential);

                    Alert.alert("Success", "Login successful!");
                    navigation.replace("Home");
                }
            } catch (error:any) {
                Alert.alert("Login failed.", error.message);
            }
        };

        handleGoogleLogin();
    }, [response]);


    return (
        <View style={styles.container}>
            <AppIcon width={80} height={80} style={styles.icon} />
            <Text style={styles.title}>Login</Text>
            <Text style={styles.text}>Sign in to continue.{"\n"}Don't have an account?
                <Text style={styles.signupLink} onPress={() => navigation.navigate("Signup")}> Sign Up</Text>
            </Text>

            <Text style={styles.inputText}>EMAIL</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.inputText}>PASSWORD</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Text style={styles.linkText}>Forgot Password?</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log in'}</Text>
            </TouchableOpacity>

            <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
                <GoogleLogo width={20} height={20} style={{marginRight: 10}} />
                <Text style={styles.googleButtonText}>Log in with Google</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
