import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity , StyleSheet} from "react-native";
import DefaultIcon from "../../../../assets/icons/default-profile-icon.svg";
import AddIcon from "../../../../assets/icons/circle-add-icon.svg";
import CheckIcon from "../../../../assets/icons/check-circle-icon.svg";
import GroupIcon from "../../../../assets/icons/group-circle-icon.svg";

interface Item {
    id: string;
    name: string;
    username?: string;
    type: "user" | "group";
    membersCount?: number; // for groups
}

interface Props {
    searchTerm: string;
}

const sampleData: Item[] = [
    { id: "1", name: "Jane Doe", username: "@jddoe", type: "user" },
    { id: "2", name: "Emma Mouse", username: "@mmouse", type: "user" },
    { id: "3", name: "House Group", membersCount: 5, type: "group" },
];

const UserOrGroupList: React.FC<Props> = ({ searchTerm }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<"user" | "group" | null>(null);

    const handleSelect = (item: Item) => {
        const isSelected = selectedIds.includes(item.id);

        if (!isSelected && selectedType && selectedType !== item.type) return;

        if (isSelected) {
            const newSelected = selectedIds.filter((id) => id !== item.id);
            setSelectedIds(newSelected);
            if (newSelected.length === 0) setSelectedType(null);
        } else {
            const newSelected = [...selectedIds, item.id];
            setSelectedIds(newSelected);
            setSelectedType(item.type);
        }
    };

    const filtered = sampleData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Friends</Text>
                <View style={styles.line} />
            </View>
            {filtered
                .filter((item) => item.type === "user")
                .map((item) => (
                    <TouchableOpacity key={item.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }} onPress={() => handleSelect(item)}>
                        <DefaultIcon width={30} height={30} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text>{item.name}</Text>
                            <Text style={{ color: "gray" }}>{item.username}</Text>
                        </View>
                        {selectedIds.includes(item.id) ? <CheckIcon width={25} height={25} /> : <AddIcon width={25} height={25} />}
                    </TouchableOpacity>
                ))}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Friends</Text>
                <View style={styles.line} />
            </View>
            {filtered
                .filter((item) => item.type === "group")
                .map((item) => (
                    <TouchableOpacity key={item.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }} onPress={() => handleSelect(item)}>
                        <GroupIcon width={30} height={30} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text>{item.name}</Text>
                            <Text style={{ color: "gray" }}>{item.membersCount} members</Text>
                        </View>
                        {selectedIds.includes(item.id) ? <CheckIcon width={25} height={25} /> : <AddIcon width={25} height={25} />}
                    </TouchableOpacity>
                ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    sectionTitle: {
        fontWeight: "600",
        fontSize: 14,
        marginRight: 8,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc", // or any color you prefer
    },
});

export default UserOrGroupList;
