import { StyleSheet } from "react-native";
import colors from "../../theme/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'white',
        paddingTop: 20,
        paddingHorizontal: 25,
    },
    topContainer: {
        display: 'flex',
        alignItems: 'center',
        flex: 0.6,
        marginTop: 40
    },

    titleText: {
        fontWeight: '600',
        fontSize: 16,
        width: '100%',
        textAlign: 'center',
        marginBottom: 20
    },
    actionText: {
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        color: colors.secondary,
        marginBottom: 20,
        width: '100%'
    },
    input: {
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 50,
        width: '100%',
        padding: 10,
        marginBottom: 20,
        borderColor: colors.tertiary
    },
    button: {
        backgroundColor: colors.primary,
        height: 40,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        marginTop: 20
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%'
    },
    bottomContainer: {
        alignItems: 'center',
        flex: 0.4,
        // width:'100%'
    },
})

export default styles;