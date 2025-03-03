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
    }
});

export default styles;
