import React, {useEffect, useState} from "react";
import { View, Text, ScrollView, TouchableOpacity , StyleSheet} from "react-native";
import DefaultIcon from "../../../../assets/icons/default-profile-icon.svg";
import AddIcon from "../../../../assets/icons/circle-add-icon.svg";
import CheckIcon from "../../../../assets/icons/check-circle-icon.svg";
import GroupIcon from "../../../../assets/icons/group-circle-icon.svg";
import {UserDisplayInfo} from "../../../utils/dataTypes";
import {auth, db} from "../../../utils/firebaseConfig";
import {getUserContacts} from "../api/userApi";
import {collection, doc, getDoc, getDocs, limit, query, where} from "firebase/firestore";


interface Props {
    searchTerm: string;
    onUserSelected: (userId: string) => void;
}

const UserOrGroupList: React.FC<Props> = ({ searchTerm, onUserSelected }) => {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [contactsUIDs, setContactsUIDs] = useState<string[]>([]);
    const [contactUsers, setContactUsers] = useState<UserDisplayInfo[]>([]);
    const [searchResults, setSearchResults] = useState<UserDisplayInfo[]>([]);
    const [loadingContacts, setLoadingContacts] = useState<boolean>(true);

    const fetchContacts = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("No user found.");
                return;
            }

            const token = await user.getIdToken();
            const data = await getUserContacts(token);

            if (!data || !Array.isArray(data.contacts)) {
                console.warn("No contacts returned or invalid format.");
                setContactsUIDs([]);
                setContactUsers([]);
                return;
            }

            const contactUIDs: string[] = data.contacts.map((c: any) => c.firebaseUid);

            setContactsUIDs(contactUIDs);

            const userDocs: UserDisplayInfo[] = [];
            for (const uid of contactUIDs) {
                const docRef = doc(db, "users", uid);
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    const d = snapshot.data();
                    userDocs.push({
                        id: uid,
                        name: d.name,
                        username: d.username,
                        isContact: true,
                    });
                }
            }
            setContactUsers(userDocs);
        } catch (error) {
            console.error("Failed to fetch contacts.", error);
        } finally {
            setLoadingContacts(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        handleSearchChange(searchTerm);
    }, [searchTerm, contactsUIDs]);

    const searchUsersInFirestore = async (term: string, contacts: string[]) => {
        const usersRef = collection(db, "users");
        const q = query(
            usersRef,
            where("username", ">=", term),
            where("username", "<=", term + "\uf8ff"),
            limit(10)
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                username: data.username,
                isContact: contacts.includes(doc.id),
            };
        });
    };

    const handleSearchChange = async (text: string) => {
        if (text.length > 1) {
            const results = await searchUsersInFirestore(text.toLowerCase(), contactsUIDs);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const renderUserItem = (user: UserDisplayInfo) => (
        <TouchableOpacity
            key={user.id}
            onPress={() => {
                const newSelected = selectedUserId === user.id ? null : user.id;
                setSelectedUserId(newSelected);
                if (newSelected) onUserSelected(newSelected);
            }}
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
                    <Text style={{ color: user.isContact ? "#666" : "orange" }}>
                        {user.username} {user.isContact ? "" : "(not in contacts)"}
                    </Text>
                </View>
            </View>
            {selectedUserId === user.id ? (
                <CheckIcon width={24} height={24} />
            ) : (
                <AddIcon width={24} height={24} />
            )}
        </TouchableOpacity>
    );

    const showSearch = searchTerm.length > 1;
    const usersToShow = showSearch ? searchResults : contactUsers;

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
                {loadingContacts ? (
                    <Text style={{ marginTop: 20 }}>Loading contacts...</Text>
                ) : usersToShow.length === 0 ? (
                    <Text style={{ marginTop: 20, textAlign: "center" }}>
                        {showSearch
                            ? "No users found matching your search."
                            : "No contacts found. Use the search above to find users."}
                    </Text>
                ) : (
                    usersToShow.map(renderUserItem)
                )}
            </ScrollView>
        </View>
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
        backgroundColor: "#ccc",
    },
});

export default UserOrGroupList;
