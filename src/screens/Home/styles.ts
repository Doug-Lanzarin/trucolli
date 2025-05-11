import {StyleSheet} from "react-native";


export const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#1A2C42',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 30, 40, 0.85)',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    titleSec: {
        fontSize: 18,
        fontWeight: '400',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    button: {
        // backgroundColor: 'white',
        marginHorizontal: 18,
        height: 50,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
    },
    titleButton: {
        fontSize: 28,
        textAlign: 'center',
        letterSpacing: -2,
        fontWeight: '400',
        color: '#FFFFFF',
    }
});
