import React, {useState} from "react";
import {AuthScreenProps} from "../../../../utils/types";
import {ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import components from "../../../../styles/components";
import BackButton from "../../../../components/BackButton";
import SearchIcon from "../../../../../assets/icons/search-icon.svg";
import DefaultIcon from "../../../../../assets/icons/default-profile-icon.svg";
import CheckIcon from "../../../../../assets/icons/check-circle-icon.svg";
import AddIcon from "../../../../../assets/icons/circle-add-icon.svg";

const AddGroupScreen: React.FC<AuthScreenProps<"AddGroup">> = ( { navigation } ) => {
    const [name, setName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const users = [
        { id: "1", name: "Jane Doe", username: "@jdoe" },
        { id: "2", name: "Ema Mouse", username: "@mmouse" },
        { id: "3", name: "John Smith", username: "@jsmith" },
    ];

    const toggleUserSelection = (userId: string) => {
        setSelectedUserIds((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    return (
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Create group</Text>
            <Text style={{marginTop:20}}>Group Name</Text>
            <View style={components.container}>
                <TextInput
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <Text style={{marginTop:20}}>Members</Text>
            <View style={[components.container, { flexDirection: "row", alignItems: "center" }]}>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder="Search"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                <SearchIcon width={20} height={20} />
            </View>

            <View style={{ flex: 1 }}>
                <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
                    <View>
                        {users
                            .filter(
                                (user) =>
                                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    user.username.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((user) => {
                                const isSelected = selectedUserIds.includes(user.id);
                                return (
                                    <TouchableOpacity
                                        key={user.id}
                                        onPress={() => toggleUserSelection(user.id)}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            paddingVertical: 10,
                                            borderBottomWidth: 1,
                                            borderBottomColor: "#eee",
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <DefaultIcon width={40} height={40} />
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={{ fontWeight: "600" }}>{user.name}</Text>
                                                <Text style={{ color: "#666" }}>{user.username}</Text>
                                            </View>
                                        </View>

                                        {isSelected ? (
                                            <CheckIcon width={24} height={24} />
                                        ) : (
                                            <AddIcon width={24} height={24} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                    </View>
                </ScrollView>
            </View>

            <TouchableOpacity style={components.button}>
                <Text style={components.buttonText}>Create group</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddGroupScreen;
