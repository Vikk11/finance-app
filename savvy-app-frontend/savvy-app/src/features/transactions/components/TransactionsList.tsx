import React, { useEffect, useState } from "react";
import { View, FlatList, Text, ActivityIndicator} from "react-native";
import {TransactionResponse} from "../../../utils/dataTypes";
import ReceiveMoneyIcon from "../../../../assets/transaction-icons/receive-money.svg";
import SendMoneyIcon from "../../../../assets/transaction-icons/send-money.svg";
import AddMoneyIcon from "../../../../assets/transaction-icons/added-money.svg";
import DefaultIcon from "../../../../assets/icons/default-profile-icon.svg";
import styles from "../../auth/screens/home/style";
import {fetchTransactionsPage} from "../api/transactionApi";
import {auth} from "../../../utils/firebaseConfig";

const PAGE_SIZE = 20;

const TransactionsList: React.FC = () => {
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    const getTransactionIcon = (t: TransactionResponse) => {
        if (t.relatedUserId) {
            return t.type === "INCOME" ? <ReceiveMoneyIcon /> : <SendMoneyIcon />;
        }
        return t.type === "INCOME"
            ? <AddMoneyIcon width={35} height={35} />
            : <DefaultIcon width={35} height={35} />;
    };

    const loadTransactions = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
            console.error("No user found.");
            return;
        }

        const token = await user.getIdToken();
        const res = await fetchTransactionsPage(page, PAGE_SIZE, token);
        setTransactions(prev => [...prev, ...res]);
        setPage(prev => prev + 1);
        setHasMore(res.length === PAGE_SIZE);
        setLoading(false);
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <FlatList
            data={transactions}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.transactionRow}>
                    <View style={styles.iconContainer}>
                        {getTransactionIcon(item)}
                    </View>
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionName}>
                            {item.name || "Unnamed Transaction"}
                        </Text>
                        <Text style={styles.transactionDate}>
                            {formatDate(item.date)}
                        </Text>
                    </View>
                    <Text style={styles.transactionAmount}>
                        {item.type === "INCOME" ? "+" : "-"}€{item.amount.toFixed(2)}
                    </Text>
                </View>
            )}
            onEndReached={loadTransactions}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
        />
    );
};

export default TransactionsList;
