// FodinhaScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StatusBar,
    ActivityIndicator,
    Platform,
    ScrollView,
    Image,
    SafeAreaView,
    TextInput,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles.ts';
import { BOTTOM_INSET, STATUSBAR_HEIGHT } from "./constants.ts";
import {useNavigation} from "@react-navigation/native";

// Define types
interface Player {
    id: string;
    name: string;
    lives: number;
    isAlive: boolean;
}

interface GameState {
    players: Player[];
    gameStarted: boolean;
    gameOver: boolean;
    winner: Player | null;
    roundHistory: RoundHistoryItem[];
}

interface RoundHistoryItem {
    playerId: string;
    livesLost: number;
    timestamp: number;
}

const STORAGE_KEY = '@fodinha_game_tracker';
const MAX_PLAYERS = 10;
const MIN_PLAYERS = 2;
const INITIAL_LIVES = 3;

const LittleFuckScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayerName, setNewPlayerName] = useState<string>('');
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [winner, setWinner] = useState<Player | null>(null);
    const [roundHistory, setRoundHistory] = useState<RoundHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const headerOpacity = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const winnerOverlayOpacity = useRef(new Animated.Value(0)).current;

    // Load game state
    // Modifique a inicialização dos jogadores para começar com uma lista vazia
// Substitua este trecho no useEffect de carregamento:

    useEffect(() => {
        const loadGameState = async (): Promise<void> => {
            try {
                const savedState = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedState) {
                    const parsedState: GameState = JSON.parse(savedState);
                    setPlayers(parsedState.players);
                    setGameStarted(parsedState.gameStarted);
                    setGameOver(parsedState.gameOver);
                    setWinner(parsedState.winner);
                    setRoundHistory(parsedState.roundHistory);

                    if (parsedState.gameOver && parsedState.winner) {
                        Animated.timing(winnerOverlayOpacity, {
                            toValue: 1,
                            duration: 0,
                            useNativeDriver: true,
                        }).start();
                    }
                } else {
                    // Iniciar com lista vazia em vez de jogadores padrão
                    setPlayers([]);
                }
            } catch (error) {
                console.error('Failed to load game state:', error);
                // Iniciar com lista vazia em caso de erro
                setPlayers([]);
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

    // Save game state
    useEffect(() => {
        const saveGameState = async (): Promise<void> => {
            try {
                if (isLoading) return;

                const gameState: GameState = {
                    players,
                    gameStarted,
                    gameOver,
                    winner,
                    roundHistory,
                };

                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
            } catch (error) {
                console.error('Failed to save game state:', error);
            }
        };

        saveGameState();
    }, [players, gameStarted, gameOver, winner, roundHistory, isLoading]);

    // Helper to create a new player
    const createPlayer = (name: string): Player => ({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name,
        lives: INITIAL_LIVES,
        isAlive: true,
    });

    // Add a new player
    const addPlayer = (): void => {
        if (players.length >= MAX_PLAYERS) {
            Alert.alert('Limite de jogadores', `Máximo de ${MAX_PLAYERS} jogadores permitido.`);
            return;
        }

        if (!newPlayerName.trim()) {
            Alert.alert('Nome inválido', 'Por favor, insira um nome para o jogador.');
            return;
        }

        setPlayers(prev => [...prev, createPlayer(newPlayerName.trim())]);
        setNewPlayerName('');
    };

    // Remove a player
    const removePlayer = (id: string): void => {

        setPlayers(prev => prev.filter(player => player.id !== id));
    };

    // Decrease player lives
    const decreaseLives = (player: Player): void => {
        if (!gameStarted) {
            Alert.alert('Jogo não iniciado', 'Inicie o jogo para começar a jogar.');
            return;
        }

        if (!player.isAlive || player.lives <= 0) return;

        const newLives = player.lives - 1;
        const isAlive = newLives > 0;

        // Add to history
        setRoundHistory(prev => [
            ...prev,
            {
                playerId: player.id,
                livesLost: 1,
                timestamp: Date.now(),
            }
        ]);

        // Update player
        setPlayers(prev =>
            prev.map(p =>
                p.id === player.id
                    ? { ...p, lives: newLives, isAlive }
                    : p
            )
        );

        // Check game over condition
        const alivePlayers = players
            .map(p => p.id === player.id ? { ...p, lives: newLives, isAlive } : p)
            .filter(p => p.isAlive);

        if (alivePlayers.length === 1) {
            handleGameOver(alivePlayers[0]);
        }
    };

    // Increase player lives
    const increaseLives = (player: Player): void => {
        if (!gameStarted) {
            Alert.alert('Jogo não iniciado', 'Inicie o jogo para começar a jogar.');
            return;
        }

        if (!player.isAlive) return;

        setPlayers(prev =>
            prev.map(p =>
                p.id === player.id
                    ? { ...p, lives: p.lives < 3 ? p.lives + 1 : p.lives}
                    : p
            )
        );

        // Add to history (negative value for lives gained)
        setRoundHistory(prev => [
            ...prev,
            {
                playerId: player.id,
                livesLost: -1,
                timestamp: Date.now(),
            }
        ]);
    };

    // Handle game over
    const handleGameOver = (winningPlayer: Player): void => {
        setGameOver(true);
        setWinner(winningPlayer);

        Animated.timing(winnerOverlayOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    // Start a new game
    const startGame = (): void => {
        if (players.length < MIN_PLAYERS) {
            Alert.alert('Jogadores insuficientes', `Mínimo de ${MIN_PLAYERS} jogadores necessário.`);
            return;
        }

        setGameStarted(true);
    };

    // Start a new round (reset lives)
    const startNewRound = (): void => {
        setPlayers(prev =>
            prev.map(player => ({
                ...player,
                lives: INITIAL_LIVES,
                isAlive: true,
            }))
        );
        setGameStarted(true);
        setGameOver(false);
        setWinner(null);
        setRoundHistory([]);

        Animated.timing(winnerOverlayOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const resetEverything = async (): Promise<void> => {
        setPlayers([]);
        setGameStarted(false);
        setGameOver(false);
        setWinner(null);
        setRoundHistory([]);

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

    // Undo last action
    const undoLastAction = (): void => {
        if (roundHistory.length === 0) return;

        const lastAction = roundHistory[roundHistory.length - 1];
        setRoundHistory(prev => prev.slice(0, -1));

        // Find the player
        const playerIndex = players.findIndex(p => p.id === lastAction.playerId);
        if (playerIndex === -1) return;

        // Update player lives
        const updatedPlayers = [...players];
        const player = updatedPlayers[playerIndex];

        // Reverse the action (add lives if they were lost, remove if they were gained)
        const newLives = player.lives + lastAction.livesLost;
        const isAlive = newLives > 0;

        updatedPlayers[playerIndex] = {
            ...player,
            lives: newLives,
            isAlive,
        };

        setPlayers(updatedPlayers);

        // If game was over, revert it
        if (gameOver) {
            setGameOver(false);
            setWinner(null);

            Animated.timing(winnerOverlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    // Render player card
    const renderPlayerCard = (player: Player): React.ReactElement => {
        const livesArray = Array.from({ length: player.lives }, (_, i) => i);
        const emptyLivesArray = Array.from({ length: INITIAL_LIVES - player.lives }, (_, i) => i);

        return (
            <View
                key={player.id}
                style={[
                    styles.playerCard,
                    !player.isAlive && styles.eliminatedPlayerCard
                ]}
            >
                <View style={styles.playerHeader}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    {!gameStarted && (
                        <TouchableOpacity
                            style={styles.removePlayerButton}
                            onPress={() => removePlayer(player.id)}
                        >
                            <MaterialIcon name="delete" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.livesContainer}>
                    {livesArray.map((_, index) => (
                        <Icon key={`life-${index}`} name="heart" size={24} color="#e74c3c" />
                    ))}
                    {emptyLivesArray.map((_, index) => (
                        <Icon key={`empty-${index}`} name="heart-o" size={24} color="#e74c3c" />
                    ))}
                </View>

                {gameStarted && player.isAlive && (
                    <View style={styles.playerActions}>
                        <TouchableOpacity
                            style={styles.decreaseButton}
                            onPress={() => decreaseLives(player)}
                            disabled={gameOver}
                        >
                            <Text style={styles.actionButtonText}>-1</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.increaseButton, {backgroundColor: player.lives === 3 ? '#A9A9A9' : 'rgba(46, 204, 113, 0.8)'}]}
                            onPress={() => increaseLives(player)}
                            disabled={gameOver || player.lives === 3}
                        >
                            <Text style={styles.actionButtonText}>+1</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!player.isAlive && (
                    <View style={styles.eliminatedBadge}>
                        <Text style={styles.eliminatedText}>Eliminado</Text>
                    </View>
                )}
            </View>
        );
    };

    // Render winner modal
    const renderWinnerModal = (): React.ReactElement => {
        return (
            <Animated.View
                style={[
                    styles.winnerOverlay,
                    { opacity: winnerOverlayOpacity }
                ]}
                pointerEvents={gameOver ? 'auto' : 'none'}
            >
                <View style={styles.winnerContainer}>
                    <View style={styles.winnerCard}>
                        <View style={styles.winnerHeader}>
                            <Text style={styles.winnerTitle}>
                                {winner?.name} Venceu!
                            </Text>
                        </View>
                        <View style={styles.winnerBody}>
                            <View style={styles.winnerLivesContainer}>
                                <Icon name="heart" size={32} color="#e74c3c" />
                                <Text style={styles.winnerLivesText}>
                                    {winner?.lives} {winner?.lives === 1 ? 'vida' : 'vidas'} restante
                                </Text>
                            </View>
                            <View style={styles.winnerStatsContainer}>
                                <Text style={styles.winnerStatsText}>
                                    {players.length} jogadores participaram
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
                <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.3)" translucent={true} />
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
        <SafeAreaView style={styles.backgroundContainer}>
            <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.3)" translucent={true} />
            <View style={{ height: STATUSBAR_HEIGHT }} />

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
                            <Text style={styles.title}>Fod</Text>
                            <Image
                                source={require('../../../assets/ollidark.png')}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.headerButtons}>
                            {gameStarted && (
                                <TouchableOpacity
                                    style={[styles.headerButton, roundHistory.length === 0 && styles.disabledButton]}
                                    onPress={undoLastAction}
                                    disabled={roundHistory.length === 0}
                                >
                                    <Text style={styles.headerButtonText}>Desfazer</Text>
                                </TouchableOpacity>
                            )}
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
                >
                    <Animated.View style={[styles.contentContainer, { opacity: contentOpacity }]}>

                        {!gameStarted && (
                            <View style={styles.setupContainer}>
                                <Text style={styles.setupTitle}>Configurar Jogadores</Text>

                                {/* Adicione esta mensagem informativa */}
                                <Text style={styles.setupInfo}>
                                    Adicione pelo menos {MIN_PLAYERS} jogadores para iniciar o jogo.
                                    {players.length > 0 ? ` (${players.length}/${MIN_PLAYERS})` : ''}
                                </Text>

                                <View style={styles.addPlayerContainer}>
                                    <TextInput
                                        style={styles.playerInput}
                                        placeholder="Nome do jogador"
                                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                        value={newPlayerName}
                                        onChangeText={setNewPlayerName}
                                        maxLength={20}
                                    />
                                    <TouchableOpacity
                                        style={[
                                            styles.addPlayerButton,
                                            (!newPlayerName.trim() || players.length >= MAX_PLAYERS) && styles.disabledButton
                                        ]}
                                        onPress={addPlayer}
                                        disabled={!newPlayerName.trim() || players.length >= MAX_PLAYERS}
                                    >
                                        <Text style={{fontSize: 24, color: "#FFFFFF"}}>+</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Lista de jogadores adicionados */}
                                {players.length > 0 && (
                                    <View style={styles.playersList}>
                                        <Text style={styles.playersListTitle}>Jogadores adicionados:</Text>
                                        {players.map((player, index) => (
                                            <View key={player.id} style={styles.playerListItem}>
                                                <Text style={styles.playerListName}>{index + 1}. {player.name}</Text>
                                                <TouchableOpacity
                                                    style={styles.removePlayerButton}
                                                    onPress={() => removePlayer(player.id)}
                                                >
                                                    <Text style={{fontSize: 18, color: "#FFFFFF"}}>🗑️</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                <TouchableOpacity
                                    style={[
                                        styles.startGameButton,
                                        players.length < MIN_PLAYERS && styles.disabledButton
                                    ]}
                                    onPress={startGame}
                                    disabled={players.length < MIN_PLAYERS}
                                >
                                    <Text style={styles.startGameButtonText}>
                                        {players.length < MIN_PLAYERS
                                            ? `Adicione mais ${MIN_PLAYERS - players.length} jogador(es)`
                                            : 'Iniciar Jogo'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={styles.playersContainer}>
                            {players.map(renderPlayerCard)}
                        </View>
                    </Animated.View>
                </ScrollView>
                <View style={{ height: BOTTOM_INSET }} />
            </View>
            {renderWinnerModal()}
        </SafeAreaView>
    );
};

export default LittleFuckScreen;
