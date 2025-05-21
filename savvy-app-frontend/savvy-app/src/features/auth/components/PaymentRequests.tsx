import React, {useState, useEffect} from "react";
import {View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity} from "react-native";
import DefaultIcon from "../../../../assets/icons/default-profile-icon.svg";
import {PaymentRequest, UserDisplayInfo,} from "../../../utils/dataTypes";
import {getAllRequests} from "../api/paymentRequestApi";
import {auth, db} from "../../../utils/firebaseConfig";
import {useNavigation} from "@react-navigation/native";
import {doc, getDoc} from "firebase/firestore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../utils/types";

const PaymentRequests: React.FC<{ searchQuery: string, status: "ALL" | "PAID" | "PENDING" | "DECLINED"}> = ({ searchQuery, status }) => {
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "PaymentRequests">;
    const navigation = useNavigation<NavigationProp>();
    const [userMap, setUserMap] = useState<Record<string, UserDisplayInfo>>({});

    useEffect(() => {
        const fetchRequestsAndUsers = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.error("No user found.");
                    return;
                }

                const token = await user.getIdToken();
                const response = await getAllRequests(token);
                const requests = response.data;
                setRequests(requests);

                const allUids = new Set<string>();
                requests.forEach((r: PaymentRequest) => {
                    if (r.requesterId?.userUid) allUids.add(r.requesterId.userUid);
                    if (r.payerId?.userUid) allUids.add(r.payerId.userUid);
                });

                const userMapTemp: Record<string, UserDisplayInfo> = {};
                for (const uid of allUids) {
                    const docRef = doc(db, "users", uid);
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const d = snapshot.data();
                        userMapTemp[uid] = {
                            id: uid,
                            name: d.name,
                            username: d.username,
                            isContact: true,
                        };
                    }
                }

                setUserMap(userMapTemp);
            } catch (err) {
                console.error("Error fetching requests or user info", err);
                setError("Failed to load requests.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequestsAndUsers();
    }, []);

    const filtered = requests.filter((req) => {
        const requester = userMap[req.requesterId.userUid];
        const payer = req.payerId ? userMap[req.payerId.userUid] : null;

        const matchesSearch =
            requester?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payer?.name?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            status === "ALL" || req.status === status;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{error}</Text>
            </View>
        );
    }

    if (filtered.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No requests found</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("RequestDetails", { request: item, status: status })}
                >
                    <View style={styles.requestItem}>
                        <View style={styles.leftSection}>
                            <DefaultIcon width={40} height={40} style={styles.icon} />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.name}>
                                    {
                                        userMap[item.requesterId.userUid]?.name ??
                                        (item.payerId?.userUid ? userMap[item.payerId.userUid]?.name : "")
                                    }
                                </Text>
                                <Text style={styles.username}>
                                    @{
                                    userMap[item.requesterId.userUid]?.username ??
                                    (item.payerId?.userUid ? userMap[item.payerId.userUid]?.username : "")
                                }
                                </Text>
                                <Text style={styles.date}>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>

                        <Text
                            style={[
                                styles.status,
                                item.status === "PAID" ? styles.paid : item.status === "PENDING" ? styles.pending : styles.declined,
                            ]}
                        >
                            {item.status}
                        </Text>

                        <Text style={styles.amount}>€{item.amount}</Text>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
    requestItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    icon: {
        width: 40,
        height: 40,
    },
    name: {
        fontWeight: "bold",
        fontSize: 16,
    },
    username: {
        color: "#666",
        fontSize: 12,
    },
    date: {
        fontSize: 12,
        color: "#999",
    },
    status: {
        width: 70,
        textAlign: "center",
        fontWeight: "600",
        fontSize: 14,
    },
    paid: {
        color: "#4caf50",
    },
    pending: {
        color: "#e18b22",
    },
    declined: {
        color: "#f44336"
    },
    amount: {
        fontSize: 16,
        fontWeight: "bold",
        minWidth: 60,
        textAlign: "right",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: "#888",
    },
});


export default PaymentRequests;
