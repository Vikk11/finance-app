import {StyleSheet} from "react-native";
import colors from '../../../styles/colors'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 20,
    },
    icon: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 45,
        fontWeight: 'bold',
        color: colors.secondary,
        marginBottom: 5,
    },
    text: {
        fontSize: 14,
        color: colors.lighter_text,
        marginBottom: 30,
        textAlign: 'center',
        lineHeight: 25,
    },
    inputText: {
        fontSize: 12,
        color: colors.text,
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginLeft: 40
    },
    input: {
        width: '80%',
        backgroundColor: '#f7f9fa',
        color: colors.light_text,
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: colors.secondary,
    },
    signupLink: {
        color: colors.secondary,
    },
    linkText: {
        color: colors.secondary,
        alignSelf: 'flex-start',
        marginLeft: 50,
        marginBottom: 15,
    },
    button: {
        width: '80%',
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginVertical: 30,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    orText: {
        marginHorizontal: 10,
        fontSize: 12,
        color: colors.text,
    }
});

export default styles;
