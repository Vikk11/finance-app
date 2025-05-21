import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Alert, TouchableOpacity} from "react-native";
import components from "../../../../styles/components";
import {AuthScreenProps} from "../../../../utils/types";
import {handleRequest} from "../../api/paymentRequestApi";
import {auth, db} from "../../../../utils/firebaseConfig";
import {doc, getDoc} from "firebase/firestore";
import BackButton from "../../../../components/BackButton";


const RequestDetailsScreen: React.FC<AuthScreenProps<"RequestDetails">> = ({ route, navigation }) => {
    const { request } = route.params;

    const [requesterUsername, setRequesterUsername] = useState<string | null>(null);
    const [payerUsername, setPayerUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const requesterDoc = await getDoc(doc(db, "users", request.requesterId.userUid));
                if (requesterDoc.exists()) {
                    setRequesterUsername(requesterDoc.data().username);
                } else {
                    setRequesterUsername("Unknown");
                }

                if (request.payerId?.userUid) {
                    const payerDoc = await getDoc(doc(db, "users", request.payerId.userUid));
                    if (payerDoc.exists()) {
                        setPayerUsername(payerDoc.data().username);
                    } else {
                        setPayerUsername("Unknown");
                    }
                }
            } catch (error) {
                console.error("Failed to fetch usernames", error);
            }
        };

        fetchUsernames();
    }, [request]);

    const isRequester = request.currentUser.id === request.requesterId.id;

    const handlePaymentRequest = async (id: number, status: string) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("No user found.");
                return;
            }

            const token = await user.getIdToken();
            await handleRequest(id, status, token);
            Alert.alert("Success", "Updated request");
            navigation.goBack();
        } catch (err) {
            console.error("Failed:", err);
            Alert.alert("Error", "Failed to update request.");
        }
    };

    return (
        <View style={components.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Request Details</Text>

            <Text>From: {requesterUsername }</Text>
            <Text>To: {payerUsername}</Text>
            <Text>Status: {request.status}</Text>
            <Text>Amount: €{request.amount}</Text>
            <Text>Date: {new Date(request.createdAt).toLocaleString()}</Text>
            <Text>Description: {request.description || "No description"}</Text>

            {!isRequester && request.status === "PENDING" && (
                <>
                    <TouchableOpacity style={components.button}
                                      onPress={() => handlePaymentRequest(request.id, "PAID")}
                    >
                        <Text style={components.buttonText}>Pay now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[components.button, { backgroundColor: "#608ec3", marginTop: 10 }]}
                        onPress={() => handlePaymentRequest(request.id, "DECLINED")}
                    >
                        <Text style={components.buttonText}>Decline</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default RequestDetailsScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
});
