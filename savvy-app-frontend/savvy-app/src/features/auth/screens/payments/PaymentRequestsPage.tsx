import React, {useState} from "react";
import {AuthScreenProps} from "../../../../utils/types";
import {Text, TouchableOpacity, View, TextInput} from "react-native";
import components from "../../../../styles/components";
import BackButton from "../../../../components/BackButton";
import { Ionicons } from "@expo/vector-icons";
import PaymentRequests from "../../components/PaymentRequests";
import { Picker } from '@react-native-picker/picker';

const PaymentRequestsPage: React.FC<AuthScreenProps<"PaymentRequests">> = ( { navigation } ) => {
    const[searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING" | "DECLINED">("ALL");
    const [showPicker, setShowPicker] = useState(false);

    return (
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Requests</Text>

            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                <TextInput
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={{
                        flex: 1,
                        backgroundColor: "#f2f5f7",
                        borderRadius: 8,
                        padding: 10,
                        marginRight: 10,
                    }}
                />

                <TouchableOpacity
                    style={{ padding: 10, backgroundColor: "#f2f5f7", borderRadius: 8 }}
                    onPress={() => setShowPicker((prev) => !prev)}
                >
                    <Ionicons name="filter" size={20} />
                </TouchableOpacity>
            </View>

            {showPicker && (
                <View
                    style={{
                        backgroundColor: "#f2f5f7",
                        borderRadius: 8,
                        marginBottom: 10,
                        overflow: "hidden",
                    }}
                >
                    <Picker
                        selectedValue={statusFilter}
                        onValueChange={(value) => {
                            setStatusFilter(value);
                            setShowPicker(false);
                        }}
                        style={{ height: 40 }}
                        dropdownIconColor="#000"
                    >
                        <Picker.Item label="All" value="ALL" />
                        <Picker.Item label="Paid" value="PAID" />
                        <Picker.Item label="Pending" value="PENDING" />
                        <Picker.Item label="Declined" value="DECLINED" />
                    </Picker>
                </View>
            )}

            <PaymentRequests searchQuery={searchQuery} status={statusFilter}/>

            <TouchableOpacity style={[components.button, { marginTop: "auto" }]} onPress={() => navigation.navigate("CreatePaymentRequest")}>
                <Text style={components.buttonText}>Send new request</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PaymentRequestsPage;
