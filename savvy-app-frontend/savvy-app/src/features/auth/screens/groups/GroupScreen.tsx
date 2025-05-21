import React, {useState} from "react";
import {AuthScreenProps} from "../../../../utils/types";
import {Text, TextInput, TouchableOpacity, View, ScrollView} from "react-native";
import components from "../../../../styles/components";
import BackButton from "../../../../components/BackButton";
import SearchIcon from "../../../../../assets/icons/search-icon.svg";
import GroupIcon from "../../../../../assets/icons/group-circle-icon.svg";

const GroupScreen: React.FC<AuthScreenProps<"Groups">> = ( { navigation } ) => {
    const [searchTerm, setSearchTerm] = useState("");

    const groups = [
        { id: "1", name: "House Group", members: 8 },
        { id: "2", name: "Priqteli", members: 5 },
    ];

    return (
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Groups</Text>
            <View style={[components.container, { flexDirection: "row", alignItems: "center" }]}>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder="Search"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                <SearchIcon width={20} height={20} />
            </View>

            <View style={{flexGrow:1}}>
                <ScrollView style={{ marginTop: 10 }}>
                    {groups
                        .filter((group) =>
                            group.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((group) => (
                            <TouchableOpacity
                                key={group.id}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    paddingVertical: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#eee",
                                }}
                                onPress={() => {
                                }}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <GroupIcon width={40} height={40} /> {/* <-- Use your actual group icon here */}
                                    <Text style={{ marginLeft: 10, fontWeight: "600" }}>
                                        {group.name}
                                    </Text>
                                </View>
                                <Text style={{ color: "#666", marginRight: 5 }}>
                                    {group.members} members
                                </Text>
                            </TouchableOpacity>
                        ))}
                </ScrollView>
            </View>

            <TouchableOpacity style={components.button} onPress={() => navigation.navigate("AddGroup")}>
                <Text style={components.buttonText}>Create new group</Text>
            </TouchableOpacity>
        </View>
    );
};

export default GroupScreen;
