import React, {useState, useEffect} from "react";
import {AuthScreenProps} from "../../../../utils/types";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import components from "../../../../styles/components";
import BackButton from "../../../../components/BackButton";
import UserOrGroupList from "../../components/UserOrGroupList";
import SearchIcon from "../../../../../assets/icons/search-icon.svg"

const CreatePaymentRequest: React.FC<AuthScreenProps<"CreatePaymentRequest">> = ( { navigation } ) => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

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

            <UserOrGroupList searchTerm={searchTerm} />

            <TouchableOpacity style={components.button}>
                <Text style={components.buttonText}>Send request</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreatePaymentRequest;
