import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert, Platform} from 'react-native';
import {createUserWithEmailAndPassword, sendEmailVerification, signInWithCredential, GoogleAuthProvider} from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../utils/firebaseConfig";
import styles from './styles';
import BackIcon from '../../../../assets/icons/back-arrow.svg'
import { AuthScreenProps } from "../../../utils/types";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Yup from 'yup';
import * as Google from 'expo-auth-session/providers/google';
import GoogleLogo from '../../../../assets/icons/google_logo.svg';
import Constants from "expo-constants";

const SignupScreen: React.FC<AuthScreenProps<"Signup">> = ( { navigation } ) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDob(selectedDate);
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        dob: Yup.date().required("Date of birth is required"),
        username: Yup.string().required("Username is required"),
    });

    const handleSignup = async () => {
        try {
            await validationSchema.validate({ name, email, password, dob, username });
            setLoading(true);

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);

            await setDoc(doc(db, "users", user.uid),{
                name,
                email,
                dob,
                username,
                createdAt: new Date()
            });

            alert("Signup successful! Please verify your email.");
            navigation.navigate("Login");
        } catch (error: unknown) {
            if(error instanceof Error){
                alert(`Signup Error: ${error.message}`);
            } else {
                alert("An unknown error occurred.");
            }
        }
        setLoading(false);
    };

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: Constants.expoConfig?.extra?.FIREBASE_WEB_CLIENT_ID,
    });

    useEffect(() => {
        const handleGoogleSignup = async () => {
            try {
                if (response?.type === "success") {
                    const { id_token } = response.params;
                    const googleCredential = GoogleAuthProvider.credential(id_token);
                    const userCredential = await signInWithCredential(auth, googleCredential);

                    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
                    if (!userDoc.exists()) {
                        await setDoc(doc(db, "users", userCredential.user.uid),{
                            name: userCredential.user.displayName,
                            email: userCredential.user.email,
                            dob: null,
                            username: userCredential.user.displayName,
                            createdAt: new Date(),
                        });
                    } else {
                        alert("User with that email already exists");
                    }
                    alert("Signup successful!");
                    navigation.replace("Home");
                }
            } catch (error: unknown) {
                if (error instanceof Error){
                    alert(`Google Signup Error: ${error.message}`);
                } else {
                    alert("An unknown error occurred.");
                }
            }
        };

        handleGoogleSignup();
    }, [response]);

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
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input} >
                    <Text>{dob.toDateString()}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={dob || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                    />
                )}

                <Text style={styles.inputText}>USERNAME</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                />

                <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Signing up..." : "Sign up"}</Text>
                </TouchableOpacity>

                <View style={styles.orContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
                    <GoogleLogo width={20} height={20} style={{marginRight: 10}} />
                    <Text style={styles.googleButtonText}>Sign up with Google</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignupScreen;
