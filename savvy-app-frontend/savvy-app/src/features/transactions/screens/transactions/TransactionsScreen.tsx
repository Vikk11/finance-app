import React from "react";
import {TransactionScreenProps} from "../../../../utils/types";
import {Text, TouchableOpacity, View} from "react-native";
import components from "../../../../styles/components";
import BackButton from "../../../../components/BackButton";
import TransactionsList from "../../components/TransactionsList";

const TransactionsScreen: React.FC<TransactionScreenProps<"AllTransactions">> = ( { navigation } ) => {

    return (
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>

            <Text style={components.pageTitle}>Transactions</Text>

            <View style={{ flex: 1 }}>
                <TransactionsList  />
            </View>
        </View>
    );
};

export default TransactionsScreen;
