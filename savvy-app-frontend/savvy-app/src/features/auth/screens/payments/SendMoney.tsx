import React, {useState, useEffect} from "react";
import {AuthScreenProps} from "../../../../utils/types";
import {ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import components from "../../../../styles/components";
import BackButton from "../../../../components/BackButton";
import SearchIcon from "../../../../../assets/icons/search-icon.svg";
import DefaultIcon from "../../../../../assets/icons/default-profile-icon.svg";
import CheckIcon from "../../../../../assets/icons/check-circle-icon.svg";
import AddIcon from "../../../../../assets/icons/circle-add-icon.svg";
import { auth, db } from "../../../../utils/firebaseConfig";
import { doc, collection, query, where, getDocs, limit, getDoc } from "firebase/firestore";
import {UserDisplayInfo} from "../../../../utils/dataTypes";
import {getUserContacts, sendMoney} from "../../api/userApi";

const SendMoney: React.FC<AuthScreenProps<"SendMoney">> = ( { navigation } ) => {
    const [amount, setAmount] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
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
            const contactUIDs: string[] = data.contacts.map((c:any) => c.firebaseUid);
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
                isContact: contacts.includes(doc.id)
            };
        });
    };

    const handleSearchChange = async (text:string) => {
        setSearchTerm(text);
        if(text.length > 1){
            const results = await searchUsersInFirestore(text.toLowerCase(), contactsUIDs);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleSendMoney = async () => {
        if (!selectedUserId || !amount) return;

        try {
            const user = auth.currentUser;
            if (!user) {
                alert("User not authenticated.");
                return;
            }
            const token = await user.getIdToken();
            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                alert("Enter a valid amount.");
                return;
            }

            await sendMoney(token, selectedUserId, numericAmount);

            alert("Money sent successfully!");

            setAmount("");
            setSelectedUserId(null);
            setSearchTerm("");
            setSearchResults([]);
        } catch (err: any) {
            console.error(err);
            alert("Failed to send money.");
        }
    };

    const renderUserItem = (user: UserDisplayInfo) => (
        <TouchableOpacity
            key={user.id}
            onPress={() => setSelectedUserId(selectedUserId === user.id ? null : user.id)}
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
        <View style={components.background}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
            </TouchableOpacity>
            <Text style={components.pageTitle}>Send Money</Text>

            <Text style={{marginTop:20}}>Enter amount*</Text>
            <View style={components.container}>
                <TextInput
                    style={components.moneyText}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>
            <Text style={{marginTop:20}}>Select a user</Text>
            <View style={[components.container, { flexDirection: "row", alignItems: "center" }]}>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder="Search"
                    value={searchTerm}
                    onChangeText={handleSearchChange}
                />
                <SearchIcon width={20} height={20} />
            </View>

            <View style={{ flex: 1 }}>
                <ScrollView style={{ maxHeight: 250}} showsVerticalScrollIndicator={false}>
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

            <TouchableOpacity style={components.button}
                              disabled={!amount || !selectedUserId}
                              onPress={handleSendMoney}
            >
                <Text style={components.buttonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SendMoney;
