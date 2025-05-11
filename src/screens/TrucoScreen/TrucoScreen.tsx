import React, {useState, useRef, useEffect, ReactElement} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StatusBar,
    ActivityIndicator,
    Platform,
    ScrollView, Image, SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GameState, ScoreHistoryItem} from "./types";
import {styles} from "./styles";
import {BOTTOM_INSET, MAX_SCORE, STATUSBAR_HEIGHT, STORAGE_KEY} from "./constants";
import Icon from "react-native-vector-icons/FontAwesome";
import {useNavigation} from "@react-navigation/native";



const TrucoScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [team1Score, setTeam1Score] = useState<number>(0);
    const [team2Score, setTeam2Score] = useState<number>(0);
    const [team1Wins, setTeam1Wins] = useState<number>(0);
    const [team2Wins, setTeam2Wins] = useState<number>(0);
    const [scoreHistory, setScoreHistory] = useState<ScoreHistoryItem[]>([]);
    const [winningTeam, setWinningTeam] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const team1ScaleAnim = useRef(new Animated.Value(1)).current;
    const team2ScaleAnim = useRef(new Animated.Value(1)).current;
    const winnerOverlayOpacity = useRef(new Animated.Value(0)).current;
    const team1WinBadgeAnim = useRef(new Animated.Value(1)).current;
    const team2WinBadgeAnim = useRef(new Animated.Value(1)).current;
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loadGameState = async (): Promise<void> => {
            try {
                const savedState = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedState) {
                    const parsedState: GameState = JSON.parse(savedState);
                    setTeam1Score(parsedState.team1Score);
                    setTeam2Score(parsedState.team2Score);
                    setTeam1Wins(parsedState.team1Wins || 0); // Handle older saved states
                    setTeam2Wins(parsedState.team2Wins || 0); // Handle older saved states
                    setScoreHistory(parsedState.scoreHistory);

                    if (parsedState.winningTeam) {
                        setWinningTeam(parsedState.winningTeam);
                        Animated.timing(winnerOverlayOpacity, {
                            toValue: 1,
                            duration: 0, // Immediate
                            useNativeDriver: true,
                        }).start();
                    }
                }
            } catch (error) {
                console.error('Failed to load game state:', error);
            } finally {
                setIsLoading(false);
                Animated.stagger(150, [
                    Animated.timing(headerOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(contentOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        };
        loadGameState();
    }, []);

    useEffect(() => {
        const saveGameState = async (): Promise<void> => {
            try {
                if (isLoading) return;
                const gameState: GameState = {
                    team1Score,
                    team2Score,
                    team1Wins,
                    team2Wins,
                    scoreHistory,
                    winningTeam,
                };
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
            } catch (error) {
                console.error('Failed to save game state:', error);
            }
        };
        saveGameState();
    }, [team1Score, team2Score, team1Wins, team2Wins, scoreHistory, winningTeam, isLoading]);

    const addScore = (team: 1 | 2, points: number): void => {
        const historyItem: ScoreHistoryItem = {
            team,
            points,
            timestamp: Date.now(),
        };
        setScoreHistory(prev => [...prev, historyItem]);
        if (team === 1) {
            const newScore = Math.min(team1Score + points, MAX_SCORE);
            setTeam1Score(newScore);
            animateScore(team1ScaleAnim);
            if (newScore >= MAX_SCORE) {
                handleWin(1);
            }
        } else {
            const newScore = Math.min(team2Score + points, MAX_SCORE);
            setTeam2Score(newScore);
            animateScore(team2ScaleAnim);
            if (newScore >= MAX_SCORE) {
                handleWin(2);
            }
        }
    };

    const handleWin = (team: number): void => {
        setWinningTeam(team);
        if (team === 1) {
            setTeam1Wins(prev => prev + 1);
            animateWinBadge(team1WinBadgeAnim);
        } else {
            setTeam2Wins(prev => prev + 1);
            animateWinBadge(team2WinBadgeAnim);
        }
        Animated.timing(winnerOverlayOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    const animateScore = (animatedValue: Animated.Value): void => {
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1.1,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const animateWinBadge = (animatedValue: Animated.Value): void => {
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1.3,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const startNewRound = (): void => {
        setTeam1Score(0);
        setTeam2Score(0);
        setWinningTeam(null);
        setScoreHistory([]);
        Animated.timing(winnerOverlayOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const resetEverything = async (): Promise<void> => {
        setTeam1Score(0);
        setTeam2Score(0);
        setTeam1Wins(0);
        setTeam2Wins(0);
        setWinningTeam(null);
        setScoreHistory([]);
        Animated.timing(winnerOverlayOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear saved game state:', error);
        }
    };

    const undoLastAction = (): void => {
        if (scoreHistory.length === 0) return;
        const lastAction = scoreHistory[scoreHistory.length - 1];
        setScoreHistory(prev => prev.slice(0, -1));
        if (lastAction.team === 1) {
            setTeam1Score(prev => Math.max(prev - lastAction.points, 0));
        } else {
            setTeam2Score(prev => Math.max(prev - lastAction.points, 0));
        }
        if (winningTeam !== null) {
            if (winningTeam === 1) {
                setTeam1Wins(prev => Math.max(prev - 1, 0));
            } else {
                setTeam2Wins(prev => Math.max(prev - 1, 0));
            }
            setWinningTeam(null);
            Animated.timing(winnerOverlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const renderScoreButtons = (team: 1 | 2): ReactElement => {
        const pointValues = [1, 3, 6, 9, 12];
        return (
            <View style={styles.buttonContainer}>
                {pointValues.map((points) => (
                    <TouchableOpacity
                        key={points}
                        style={[
                            styles.pointButton,
                            team === 1 ? styles.team1Button : styles.team2Button
                        ]}
                        activeOpacity={0.7}
                        onPress={() => addScore(team, points)}
                        disabled={winningTeam !== null}
                    >
                        <Text style={[
                            styles.pointButtonText,
                            team === 1 ? styles.team1ButtonText : styles.team2ButtonText
                        ]}>{`+${points}`}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderScoreCircle = (team: 1 | 2, score: number, animValue: Animated.Value): ReactElement => {
        if (Platform.OS === 'android') {
            return (
                <Animated.View
                    style={[
                        styles.scoreCircleContainer,
                        { transform: [{ scale: animValue }] }
                    ]}
                >
                    <View style={[
                        styles.scoreCircleOuter,
                        team === 1 ? styles.team1ScoreCircleOuter : styles.team2ScoreCircleOuter
                    ]}>
                        <View style={[
                            styles.scoreCircleInner,
                            team === 1 ? styles.team1ScoreCircleInner : styles.team2ScoreCircleInner
                        ]}>
                            <Text style={styles.scoreText}>{score}</Text>
                        </View>
                    </View>
                </Animated.View>
            );
        }

        return (
            <Animated.View
                style={[
                    styles.scoreCircle,
                    team === 1 ? styles.team1ScoreCircle : styles.team2ScoreCircle,
                    { transform: [{ scale: animValue }] }
                ]}
            >
                <Text style={styles.scoreText}>{score}</Text>
            </Animated.View>
        );
    };

    const renderWinnerModal = (): ReactElement => {
        return (
            <Animated.View
                style={[
                    styles.winnerOverlay,
                    { opacity: winnerOverlayOpacity }
                ]}
                pointerEvents={winningTeam !== null ? 'auto' : 'none'}
            >
                <View style={styles.winnerContainer}>
                    <View style={styles.winnerCard}>
                        <View style={styles.winnerHeader}>
                            <Text style={styles.winnerTitle}>
                                {winningTeam === 1 ? 'Nós Vencemos!' : 'Eles Venceram!'}
                            </Text>
                        </View>
                        <View style={styles.winnerBody}>
                            <Text style={styles.winnerScore}>
                                {winningTeam === 1 ? `${team1Score} - ${team2Score}` : `${team2Score} - ${team1Score}`}
                            </Text>
                            <View style={styles.winnerStatsContainer}>
                                <Text style={styles.winnerStatsText}>
                                    Vitórias: {winningTeam === 1 ? team1Wins : team2Wins}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.winnerActions}>
                            <TouchableOpacity
                                style={styles.newGameButton}
                                onPress={startNewRound}
                            >
                                <Text style={styles.newGameButtonText}>Nova Rodada</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={resetEverything}
                            >
                                <Text style={styles.resetButtonText}>Zerar Tudo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.backgroundContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#1A2C42" />
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingContent}>
                        <ActivityIndicator size="large" color="#FFFFFF" />
                        <Text style={styles.loadingText}>Carregando...</Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.backgroundContainer, { paddingTop: 0 }]}>
            <View style={{ height: STATUSBAR_HEIGHT }} />
            <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.3)" translucent={true} />
                <View style={styles.overlay} />
                <View style={styles.mainContainer}>
                    <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
                        <View style={styles.header}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}} >
                                <TouchableOpacity style={{height:40, width: 48, marginLeft: -18, alignItems: 'center'}} onPress={() => navigation.goBack()}>
                                    <View style={{height: 40, justifyContent: 'center'}}>
                                        <Icon name={'angle-left'} size={30} color="#FFFFFF" />
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.title}>Truc</Text>
                                    <Image
                                        source={require('../../../assets/ollidark.png')}
                                        style={styles.image}
                                    />
                            </View>
                            <View style={styles.headerButtons}>
                                <TouchableOpacity
                                    style={[styles.headerButton, scoreHistory.length === 0 && styles.disabledButton]}
                                    onPress={undoLastAction}
                                    disabled={scoreHistory.length === 0}
                                >
                                    <Text style={styles.headerButtonText}>Desfazer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={resetEverything}
                                >
                                    <Text style={styles.headerButtonText}>Zerar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        <Animated.View style={[styles.contentContainer, { opacity: contentOpacity }]}>
                            <View style={styles.scoreContainer}>
                                <View style={styles.teamContainer}>
                                    <View style={styles.teamNameContainer}>
                                        <Text style={styles.teamName}>Nós</Text>
                                        <Animated.View
                                            style={[
                                                styles.winBadge,
                                                styles.team1Badge,
                                                { transform: [{ scale: team1WinBadgeAnim }] }
                                            ]}
                                        >
                                            <Text style={styles.winBadgeText}>{team1Wins}</Text>
                                        </Animated.View>
                                    </View>
                                    {renderScoreCircle(1, team1Score, team1ScaleAnim)}
                                    {renderScoreButtons(1)}
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.teamContainer}>
                                    <View style={styles.teamNameContainer}>
                                        <Text style={styles.teamName}>Eles</Text>
                                        <Animated.View
                                            style={[
                                                styles.winBadge,
                                                styles.team2Badge,
                                                { transform: [{ scale: team2WinBadgeAnim }] }
                                            ]}
                                        >
                                            <Text style={styles.winBadgeText}>{team2Wins}</Text>
                                        </Animated.View>
                                    </View>
                                    {renderScoreCircle(2, team2Score, team2ScaleAnim)}
                                    {renderScoreButtons(2)}
                                </View>
                            </View>
                        </Animated.View>
                    </ScrollView>
                    <View style={{ height: BOTTOM_INSET }} />
                </View>
            {renderWinnerModal()}
        </SafeAreaView>
    );
};



export default TrucoScreen;
