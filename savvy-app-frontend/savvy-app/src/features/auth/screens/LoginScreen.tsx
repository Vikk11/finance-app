import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';
import AppIcon from '../../../../assets/icons/app-logo.svg'

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <AppIcon width={80} height={80} style={styles.icon} />
            <Text style={styles.title}>Login</Text>
            <Text style={styles.text}>Sign in to continue.{"\n"}Don't have an account? <Text style={styles.signupLink}>Sign Up</Text></Text>

            <Text style={styles.inputText}>USERNAME</Text>
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
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>

            <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
            </View>
        </View>
    );
};

export default LoginScreen;
