import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert} from 'react-native';
import {BudgetingScreenProps} from "../../../utils/types";
import components from "../../../styles/components";
import BackButton from "../../../components/BackButton";
import {Picker} from "@react-native-picker/picker";
import {auth} from "../../../utils/firebaseConfig";
import {fetchCategories} from "../../../utils/functions";
import {addBudget} from "../api/budgetingApi";
import {BudgetRequest} from "../../../utils/dataTypes";

const AddBudgetScreen: React.FC<BudgetingScreenProps<"AddBudget">> = ( { navigation } ) => {
    const [amount, setAmount] = useState("");
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [period, setPeriod] = useState("");

    const handleAddBudget = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid amount.");
            return;
        }

        try {
            if(!selectedCategoryId){
                alert("Please select a category.");
                return;
            }

            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Authentication error", "You must be logged in.");
                return;
            }
            const token = await user.getIdToken();

            const budgetRequest: BudgetRequest = {
                categoryId: selectedCategoryId,
                amountLimit: parseFloat(amount),
                period: period,
            };

            await addBudget(token, budgetRequest);
            Alert.alert("Success", "Budget created successfully.");
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to create budget, please try again.");
        }
    }

    useEffect(() => {
        const loadCategories = async () => {
            const data = await fetchCategories();
            if (data) setCategories(data);
        };
        loadCategories();
    }, [])

    return (
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Add budget</Text>
            <Text style={{marginTop:20}}>Enter amount limit</Text>
            <View style={components.container}>
                <TextInput
                    style={components.moneyText}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>
            <Text style={{marginTop:20}}>Select category</Text>
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
            <Text style={{marginTop:20}}>Select period</Text>
            <View style={{ flexGrow: 1 }}>
                <View style={components.container}>
                    <Picker
                        selectedValue={period}
                        onValueChange={(itemValue) => setPeriod(itemValue)}
                    >
                        <Picker.Item label="Weekly" value={null}/>
                        <Picker.Item label="Monthly" value={null}/>
                        <Picker.Item label="Yearly" value={null}/>
                    </Picker>
                </View>
            </View>
            <TouchableOpacity style={components.button} onPress={handleAddBudget}>
                <Text style={components.buttonText}>Add budget</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddBudgetScreen;
