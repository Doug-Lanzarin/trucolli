export interface ScoreHistoryItem {
    team: 1 | 2;
    points: number;
    timestamp: number;
}

export interface GameState {
    team1Score: number;
    team2Score: number;
    team1Wins: number;
    team2Wins: number;
    scoreHistory: ScoreHistoryItem[];
    winningTeam: number | null;
}
