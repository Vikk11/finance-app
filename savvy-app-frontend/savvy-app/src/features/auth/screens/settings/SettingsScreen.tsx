import React from "react";
import {AuthScreenProps} from "../../../../utils/types";
import {Alert, Text, TouchableOpacity, View} from "react-native";
import components from "../../../../styles/components";
import BackButton from "../../../../components/BackButton";
import {db, auth} from "../../../../utils/firebaseConfig";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { deleteUser } from "firebase/auth";

const SettingsScreen: React.FC<AuthScreenProps<"Settings">> = ( { navigation } ) => {
    const deleteUserAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const user = auth.currentUser;
                            if (!user) {
                                Alert.alert("Error", "User not logged in");
                                return;
                            }

                            const uid = user.uid;

                            const userRef = doc(db, "users", uid);
                            await updateDoc(userRef, {
                                name: "Deleted User",
                                email: null,
                                username: "deleted_user",
                                dob: null,
                                deletedAt: serverTimestamp()
                            });

                            await setDoc(doc(db, "deleted_users", uid), {
                                uid,
                                deletedAt: serverTimestamp()
                            });

                            await deleteUser(user);

                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Login" as never }]
                            });

                        } catch (error: any) {
                            console.error("Account deletion failed:", error);
                            Alert.alert("Error", error.message);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Settings</Text>

            <TouchableOpacity style={[components.button, {backgroundColor: "#e86b70"}]} onPress={deleteUserAccount}>
                <Text style={components.buttonText}>Delete Account</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SettingsScreen;
