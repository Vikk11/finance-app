import React from "react";
import {AuthScreenProps} from "../../../../utils/types";
import {Text, TouchableOpacity, View} from "react-native";
import components from "../../../../styles/components";
import BackButton from "../../../../components/BackButton";

const PaymentsScreen: React.FC<AuthScreenProps<"Payments">> = ( { navigation } ) => {
    return (
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Payments</Text>

            <TouchableOpacity style={components.button} onPress={() => navigation.navigate("CreatePaymentRequest")}>
                <Text style={components.buttonText}>Send new request</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PaymentsScreen;
