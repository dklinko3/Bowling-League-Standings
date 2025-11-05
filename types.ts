export interface Bowler {
  id: number;
  name: string;
  average: number;
  totalPins: number;
  gamesBowled: number;
}

export interface Team {
  id: number;
  teamNumber: number;
  name:string;
  bowlers: Bowler[];
  firstHalfPoints: number;
  secondHalfPoints: number;
  totalPoints: number;
  totalScratchPins: number;
  totalHdcpPins: number;
  totalPenalty: number;
}

export interface TeamStats extends Team {
  teamAverage: number;
}

export interface Matchup {
  team1Id: number;
  team2Id: number;
  lanes: [number, number];
}

export interface ScheduleEntry {
  week: number;
  date: string;
  matchups: Matchup[];
}

export interface GameScore {
  bowlerId: number;
  scores: [number, number, number];
}

export interface WeeklyScores {
  week: number;
  teamScores: {
    teamId: number;
    bowlerScores: GameScore[];
  }[];
}

export interface WeeklyMatchupResult {
  lanes: [number, number];
  team1: { id: number; name: string; gameScores: number[]; seriesScore: number; pointsWon: number; };
  team2: { id: number; name: string; gameScores: number[]; seriesScore: number; pointsWon: number; };
}

export interface LeagueState {
    teams: Team[];
    results: WeeklyMatchupResult[];
}