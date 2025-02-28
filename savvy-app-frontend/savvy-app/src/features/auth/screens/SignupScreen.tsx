import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';
import BackIcon from '../../../../assets/icons/back-arrow.svg'
import {AuthScreenProps} from "../../../utils/types";


const SignupScreen: React.FC<AuthScreenProps<"Signup">> = ( { navigation } ) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [username, setUsername] = useState('');

    return (
        <View style={styles.signupBackground}>
            <BackIcon width={30} height={30} style={styles.icon} onPress={() => navigation.navigate("Login")} />

            <View style={styles.signupContainer}>
                <Text style={styles.signupTitle}>Create new Account </Text>

                <Text style={styles.inputText}>NAME</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    autoCapitalize="none"
                    value={name}
                    onChangeText={setName}
                />

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

                <Text style={styles.inputText}>DATE OF BIRTH</Text>
                <TextInput
                    style={styles.input}
                    placeholder="DD/MM/YYYY"
                    autoCapitalize="none"
                    value={dob}
                    onChangeText={setDob}
                />

                <Text style={styles.inputText}>USERNAME</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>

                <View style={styles.orContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line} />
                </View>
            </View>
        </View>
    );
};

export default SignupScreen;
