import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    budgetRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: "#ccc",
    },
    leftSide: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#e3f2fd",
        justifyContent: "center",
        alignItems: "center",
    },
    categoryName: {
        fontSize: 14,
        fontWeight: "bold",
    },
    transactionCount: {
        fontSize: 12,
        color: "#777",
    },
    amountText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#1565c0",
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#eee',
        borderRadius: 3,
        overflow: 'hidden',
        marginVertical: 6,
    },
    progressFill: {
        height: 6,
        borderRadius: 3,
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 8,
    },
    transactionList: {
        paddingLeft: 50,
        paddingTop: 6,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    transactionName: {
        fontSize: 13,
        fontWeight: '500',
    },
    transactionDate: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    transactionAmount: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000',
    },
    noTransactionsText: {
        fontStyle: 'italic',
        fontSize: 14,
        color: '#777',
        padding: 8,
        textAlign: 'center',
    },
})

export default styles;
