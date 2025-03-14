import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert, Platform} from 'react-native';
import {TransactionScreenProps} from "../../../../utils/types";
import components from "../../../../styles/components";
import BackButton from "../../../../components/BackButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import {getAuth} from "firebase/auth";
import {TransactionRequest} from "../../../../utils/dataTypes";
import {addTransaction} from "../../api/transactionApi";
import { Picker } from "@react-native-picker/picker";
import { getCategories } from '../../api/transactionApi';
import {auth} from "../../../../utils/firebaseConfig";

const AddExpense: React.FC<TransactionScreenProps<"AddExpense">> = ( { navigation } ) => {
    const [amount, setAmount] = useState("");
    const [expenseName, setExpenseName] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const getToken = async () =>{
        const user = auth.currentUser;
        if(!user){
            console.error("No user found.")
            return null;
        }

        return await user.getIdToken();
    }

    const fetchCategories = async () => {
        try {
            const token = await getToken();
            if(!token) return;
            const response = await getCategories(token);
            setCategories(response);
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    }

    const handleAddExpense = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid amount.");
            return;
        }

        try {
            if(!selectedCategoryId){
                alert("Please select a category.");
                return;
            }

            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                Alert.alert("Authentication error", "You must be logged in.");
                return;
            }

            const token = await user.getIdToken();

            const transactionRequest: TransactionRequest = {
                amount: parseFloat(amount),
                type: "EXPENSE",
                categoryId: selectedCategoryId,
                relatedUserId: null,
                name: expenseName || "Added Expense",
                date: date.toISOString(),
            };

            await addTransaction(token, transactionRequest);
            Alert.alert("Success", "Money added successfully.");
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to add money, please try again.");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [])

    return (
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Add expense</Text>
            <Text style={{marginTop:20}}>Enter amount*</Text>
            <View style={components.container}>
                <TextInput
                    style={components.moneyText}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>
            <Text style={{marginTop:20}}>Select category*</Text>
            <View style={components.container}>
                <Picker
                    selectedValue={selectedCategoryId}
                    onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
                >
                    <Picker.Item label="Select category" value={null}/>
                    {categories.map((category) => (
                        <Picker.Item key={category.id} label={category.name} value={category.id}/>
                    ))}
                </Picker>
            </View>
            <Text style={{marginTop:20}}>Enter name</Text>
            <View style={components.container}>
                <TextInput
                    value={expenseName}
                    onChangeText={setExpenseName}
                />
            </View>
            <Text style={{marginTop:20}}>Add date</Text>
            <View style={{ flexGrow: 1 }}>
                <View style={components.container}>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{paddingVertical:10, paddingHorizontal:5}} >
                        <Text>{date.toDateString()}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                        />
                    )}
                </View>
            </View>
            <TouchableOpacity style={components.button} onPress={handleAddExpense}>
                <Text style={components.buttonText}>Add expense</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddExpense;
