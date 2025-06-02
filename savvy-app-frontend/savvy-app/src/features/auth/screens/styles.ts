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
    signupBackground: {
        backgroundColor: colors.secondary,
        paddingLeft: 15,
        paddingTop: 20,
    },
    signupContainer: {
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 40,
        paddingLeft: 20,
        paddingRight: 40,
        paddingVertical: 20,
        marginRight: -30,
        marginLeft: -15,
        height: '100%',
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
    signupTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.secondary,
        marginBottom: 20,
        marginHorizontal: 60,
        textAlign: 'center',
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
    },
    button: {
        width: '80%',
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
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
    },
    googleButtonText: {
        color: colors.lighter_text,
        fontSize: 15,
        fontWeight: 'bold',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        color: colors.text,
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: colors.light_text,
        justifyContent: 'center',
        width: '80%',
    },
    privacyContainer: {
        marginTop: 10,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#999',
        marginRight: 10,
        borderRadius: 3,
    },

    checkedCheckbox: {
        backgroundColor: '#1565c0',
    },

    checkboxLabel: {
        fontSize: 14,
        color: '#333',
    },

    privacyLink: {
        textDecorationLine: 'underline',
        color: '#1565c0',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    modalText: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },

    modalButton: {
        padding: 10,
        backgroundColor: '#1565c0',
        borderRadius: 5,
    },

    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default styles;
