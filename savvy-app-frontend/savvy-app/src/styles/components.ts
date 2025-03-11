import {StyleSheet} from "react-native";
import colors from './colors';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    button: {
        width: '100%',
        backgroundColor: colors.primary,
        borderRadius: 17,
        alignItems: 'center',
        paddingVertical:10,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14.5,
        fontWeight: 'bold',
    },
    container: {
        backgroundColor: colors.accent,
        borderRadius:15,
        paddingVertical: 10,
        paddingHorizontal:15,
        marginBottom:15,
        marginTop:5,
    },
    moneyText: {
        fontSize: 32,
        color: colors.light_text,
        fontWeight: 'bold',
        paddingVertical: 10,
    },
    pageTitle: {
        fontSize: 30,
        color: colors.text,
        fontWeight: 'bold',
        marginVertical:15,
    }
});

export default styles;
