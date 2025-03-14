import {StyleSheet} from "react-native";
import colors from '../../../../styles/colors';

const styles = StyleSheet.create({
    homeContainer:{
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        flexDirection: 'column',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop:5,
    },
    buttons: {
        backgroundColor: colors.primary,
        paddingHorizontal:20,
        paddingVertical:15,
        borderRadius: 10,
    },
    welcomeText: {
        fontSize: 18,
        color: colors.secondary,
        fontWeight: 'bold',
    },
    nameText: {
        fontSize: 30,
        color: colors.text,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 14,
        color: colors.text,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop:5,
    },
    transactionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding:10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    iconContainer: {
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    transactionDetails: {
        flex: 1,
        marginLeft:10,
    },
    transactionName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    transactionDate: {
        fontSize: 12,
        color: "gray",
    },
    paymentType: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 20,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default styles;
