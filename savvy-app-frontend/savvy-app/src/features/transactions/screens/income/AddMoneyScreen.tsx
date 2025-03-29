import React, { useState } from 'react'
import {View, TouchableOpacity, Text, TextInput, Alert} from 'react-native';
import components from "../../../../styles/components";
import { TransactionScreenProps } from "../../../../utils/types";
import BackButton from '../../../../components/BackButton';
import { getAuth } from 'firebase/auth';
import { addTransaction } from "../../api/transactionApi";
import {TransactionRequest} from "../../../../utils/dataTypes";

const AddMoneyScreen: React.FC<TransactionScreenProps<"AddMoney">> = ( { navigation } ) => {
    const [amount, setAmount] = useState("");

    const handleAddMoney = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid amount.");
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                Alert.alert("Authentication error", "You must be logged in.");
                return;
            }

            const token = await user.getIdToken();

            const transactionRequest: TransactionRequest = {
                amount: parseFloat(amount),
                type: "INCOME",
                categoryId: 15,
                relatedUserId: null,
                name: "Added Money",
                date: null,
            };

            await addTransaction(token, transactionRequest);
            Alert.alert("Success", "Money added successfully.");
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to add money, please try again.");
        }
    };

    return (
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Add money</Text>
            <Text style={{marginTop:20}}>Enter amount</Text>
            <View style={{ flexGrow: 1 }}>
                <View style={components.container}>
                    <TextInput
                        style={components.moneyText}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>
            </View>
            <TouchableOpacity style={components.button} onPress={handleAddMoney}>
                <Text style={components.buttonText}>Add money</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddMoneyScreen;
