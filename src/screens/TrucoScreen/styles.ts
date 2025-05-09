import {Dimensions, Platform, StatusBar, StyleSheet} from "react-native";
import {BOTTOM_INSET, STATUSBAR_HEIGHT, width} from "./constants";


export const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#1A2C42',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    image: {
        marginTop: 5,
        width: 50,
        height: 27,
        resizeMode: 'contain'
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 30, 40, 0.85)',
    },
    mainContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: STATUSBAR_HEIGHT,
    },
    loadingContent: {
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '500',
        color: '#FFFFFF',
        letterSpacing: 0.5,
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
        letterSpacing: -0.5,
    },
    headerButtons: {
        flexDirection: 'row',
    },
    headerButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    disabledButton: {
        opacity: 0.4,
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    teamContainer: {
        alignItems: 'center',
        flex: 1,
        maxWidth: width * 0.45,
    },
    teamNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    teamName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    winBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderWidth: 2,
        ...(Platform.OS === 'ios' ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
        } : {
            elevation: 4,
        }),
    },
    team1Badge: {
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
    },
    team2Badge: {
        backgroundColor: '#e74c3c',
        borderColor: '#c0392b',
    },
    winBadgeText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    scoreCircle: {
        width: width * 0.32,
        height: width * 0.32,
        borderRadius: (width * 0.32) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    team1ScoreCircle: {
        backgroundColor: 'rgba(52, 152, 219, 0.15)',
        borderColor: '#3498db',
    },
    team2ScoreCircle: {
        backgroundColor: 'rgba(231, 76, 60, 0.15)',
        borderColor: '#e74c3c',
    },
    scoreCircleContainer: {
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreCircleOuter: {
        width: width * 0.32,
        height: width * 0.32,
        borderRadius: (width * 0.32) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
    },
    team1ScoreCircleOuter: {
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
    },
    team2ScoreCircleOuter: {
        backgroundColor: '#e74c3c',
        borderColor: '#c0392b',
    },
    scoreCircleInner: {
        width: width * 0.28,
        height: width * 0.28,
        borderRadius: (width * 0.28) / 2,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    team1ScoreCircleInner: {
        borderColor: '#2980b9',
    },
    team2ScoreCircleInner: {
        borderColor: '#c0392b',
    },
    scoreText: {
        fontSize: 56,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        margin: 5,
        minWidth: 55,
        alignItems: 'center',
        borderWidth: Platform.OS === 'ios' ? 1 : 2,
        ...(Platform.OS === 'android' ? {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
        } : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
        }),
    },
    team1Button: {
        ...(Platform.OS === 'ios' ? {
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            borderColor: '#3498db',
        } : {
            backgroundColor: 'rgba(52, 152, 219, 0.3)',
            borderColor: '#3498db',
        }),
    },
    team2Button: {
        ...(Platform.OS === 'ios' ? {
            backgroundColor: 'rgba(231, 76, 60, 0.2)',
            borderColor: '#e74c3c',
        } : {
            backgroundColor: 'rgba(231, 76, 60, 0.3)',
            borderColor: '#e74c3c',
        }),
    },
    pointButtonText: {
        fontWeight: '700',
        fontSize: 18,
    },
    team1ButtonText: {
        color: Platform.OS === 'ios' ? '#3498db' : '#FFFFFF',
    },
    team2ButtonText: {
        color: Platform.OS === 'ios' ? '#e74c3c' : '#FFFFFF',
    },
    divider: {
        width: 1,
        height: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 15,
    },
    winnerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 30, 40, 0.9)',
        zIndex: 1000,
        elevation: 10,
    },
    winnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: STATUSBAR_HEIGHT,
        paddingBottom: BOTTOM_INSET,
        paddingHorizontal: 20,
    },
    winnerCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        overflow: 'hidden',
        ...(Platform.OS === 'ios' ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
        } : {
            elevation: 10,
        }),
    },
    winnerHeader: {
        width: '100%',
        backgroundColor: '#1A2C42',
        paddingVertical: 20,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    winnerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    winnerBody: {
        width: '100%',
        padding: 24,
        alignItems: 'center',
    },
    winnerScore: {
        fontSize: 48,
        fontWeight: '800',
        color: '#1A2C42',
        marginBottom: 20,
    },
    winnerStatsContainer: {
        backgroundColor: 'rgba(26, 44, 66, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    winnerStatsText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A2C42',
    },
    winnerActions: {
        width: '100%',
        padding: 24,
        paddingTop: 0,
    },
    newGameButton: {
        backgroundColor: '#1A2C42',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
        ...(Platform.OS === 'ios' ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
        } : {
            elevation: 3,
        }),
    },
    newGameButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 18,
    },
    resetButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e74c3c',
    },
    resetButtonText: {
        color: '#e74c3c',
        fontWeight: '700',
        fontSize: 18,
    },
});
