import React, {useState, useEffect} from "react";
import {AuthScreenProps} from "../../../../utils/types";
import {Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import components from "../../../../styles/components";
import BackButton from "../../../../components/BackButton";
import UserOrGroupList from "../../components/UserOrGroupList";
import SearchIcon from "../../../../../assets/icons/search-icon.svg"
import {auth} from "../../../../utils/firebaseConfig"
import API_URL from "../../../../utils/apiConfig";

const CreatePaymentRequest: React.FC<AuthScreenProps<"CreatePaymentRequest">> = ( { navigation } ) => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const handleUserSelected = (userId: string) => {
        setSelectedUserId(userId);
    };

    const handleSendRequest = async () => {
        if (!selectedUserId || !amount) {
            Alert.alert('Missing fields', 'Please fill in all required fields.');
            return;
        }

        try {
            const token = await auth.currentUser?.getIdToken();

            const requestBody = {
                groupId: null,
                payerId: selectedUserId,
                amount: parseFloat(amount),
                description,
                isRecurring: false,
                status: 'PENDING',
            };

            const response = await fetch(`${API_URL}/api/payment_requests/createRequest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                Alert.alert('Request sent');
                setAmount("");
                setDescription("");
                setSearchTerm("");
                setSelectedUserId(null);
            } else {
                const error = await response.json();
                Alert.alert('Error', error.message || 'Error sending request');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Network error', 'Failed to send request');
        }
    };

    return (
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Request Money</Text>
            <Text style={{marginTop:20}}>Enter amount*</Text>
            <View style={components.container}>
                <TextInput
                    style={components.moneyText}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>
            <Text style={{marginTop:20}}>Description</Text>
            <View style={components.container}>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                />
            </View>
            <Text style={{ marginTop: 20 }}>Select person or group</Text>
            <View style={[components.container, { flexDirection: "row", alignItems: "center" }]}>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder="Search"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                <SearchIcon width={20} height={20} />
            </View>

            <UserOrGroupList searchTerm={searchTerm} onUserSelected={handleUserSelected} />

            <TouchableOpacity
                style={components.button}
                onPress={handleSendRequest}
                disabled={!selectedUserId || !amount}
            >
                <Text style={components.buttonText}>Send request</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreatePaymentRequest;
