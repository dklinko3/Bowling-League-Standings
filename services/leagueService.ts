import { Team, TeamStats, WeeklyScores, ScheduleEntry, WeeklyMatchupResult } from '../types';

const HANDICAP_PERCENTAGE = 0.8;

// Calculate team average from its bowlers
export const getTeamAverage = (team: Team): number => {
    return team.bowlers.reduce((sum, bowler) => sum + bowler.average, 0);
};

// Calculate handicap for a match
const calculateHandicap = (team1Avg: number, team2Avg: number): number => {
    const difference = Math.abs(team1Avg - team2Avg);
    return Math.floor(difference * HANDICAP_PERCENTAGE);
};

export const processWeekScores = (
    currentTeams: Team[],
    weekScores: WeeklyScores,
    schedule: ScheduleEntry[]
): { updatedTeams: Team[]; weeklyResults: WeeklyMatchupResult[] } => {
    const updatedTeams = JSON.parse(JSON.stringify(currentTeams)) as Team[];
    const weeklyResults: WeeklyMatchupResult[] = [];
    const weekSchedule = schedule.find(s => s.week === weekScores.week);

    if (!weekSchedule) return { updatedTeams: currentTeams, weeklyResults: [] };
    
    // First, update bowler stats
    weekScores.teamScores.forEach(ts => {
        const team = updatedTeams.find(t => t.id === ts.teamId);
        if (team) {
            ts.bowlerScores.forEach(bs => {
                const bowler = team.bowlers.find(b => b.id === bs.bowlerId);
                if (bowler) {
                    const gamesTotal = bs.scores.reduce((a, b) => a + b, 0);
                    bowler.totalPins += gamesTotal;
                    bowler.gamesBowled += 3;
                    bowler.average = Math.floor(bowler.totalPins / bowler.gamesBowled);
                }
            });
        }
    });

    // Then, process matchups
    weekSchedule.matchups.forEach(matchup => {
        const team1 = updatedTeams.find(t => t.id === matchup.team1Id);
        const team2 = updatedTeams.find(t => t.id === matchup.team2Id);
        const team1Scores = weekScores.teamScores.find(ts => ts.teamId === matchup.team1Id);
        const team2Scores = weekScores.teamScores.find(ts => ts.teamId === matchup.team2Id);

        if (!team1 || !team2 || !team1Scores || !team2Scores) return;

        const team1Avg = getTeamAverage(team1);
        const team2Avg = getTeamAverage(team2);

        const handicap = calculateHandicap(team1Avg, team2Avg);
        const handicapGoesToTeam1 = team1Avg < team2Avg;

        const getGameTotal = (scores: typeof team1Scores, gameIndex: number) => 
            scores.bowlerScores.reduce((sum, bs) => sum + bs.scores[gameIndex], 0);

        const team1GameTotals = [getGameTotal(team1Scores, 0), getGameTotal(team1Scores, 1), getGameTotal(team1Scores, 2)];
        const team2GameTotals = [getGameTotal(team2Scores, 0), getGameTotal(team2Scores, 1), getGameTotal(team2Scores, 2)];

        let team1Points = 0;
        let team2Points = 0;

        // Game points (2 points per game)
        for (let i = 0; i < 3; i++) {
            const game1Total = team1GameTotals[i] + (handicapGoesToTeam1 ? handicap : 0);
            const game2Total = team2GameTotals[i] + (!handicapGoesToTeam1 ? handicap : 0);
            if (game1Total > game2Total) team1Points += 2;
            else if (game2Total > game1Total) team2Points += 2;
            else { // Tie
                team1Points += 1;
                team2Points += 1;
            }
        }
        
        const team1ScratchSeries = team1GameTotals.reduce((a, b) => a + b, 0);
        const team2ScratchSeries = team2GameTotals.reduce((a, b) => a + b, 0);

        // Total pins points (3 points)
        const team1HdcpSeries = team1ScratchSeries + (handicapGoesToTeam1 ? handicap * 3 : 0);
        const team2HdcpSeries = team2ScratchSeries + (!handicapGoesToTeam1 ? handicap * 3 : 0);
        if (team1HdcpSeries > team2HdcpSeries) team1Points += 3;
        else if (team2HdcpSeries > team1HdcpSeries) team2Points += 3;
        else { // Tie
            team1Points += 1.5;
            team2Points += 1.5;
        }

        const pointProperty = weekScores.week <= 17 ? 'firstHalfPoints' : 'secondHalfPoints';

        team1[pointProperty] += team1Points;
        team2[pointProperty] += team2Points;
        team1.totalPoints = team1.firstHalfPoints + team1.secondHalfPoints;
        team2.totalPoints = team2.firstHalfPoints + team2.secondHalfPoints;

        team1.totalScratchPins += team1ScratchSeries;
        team2.totalScratchPins += team2ScratchSeries;
        team1.totalHdcpPins += team1HdcpSeries;
        team2.totalHdcpPins += team2HdcpSeries;

        weeklyResults.push({
            lanes: matchup.lanes,
            team1: { id: team1.id, name: team1.name, gameScores: team1GameTotals, seriesScore: team1ScratchSeries, pointsWon: team1Points },
            team2: { id: team2.id, name: team2.name, gameScores: team2GameTotals, seriesScore: team2ScratchSeries, pointsWon: team2Points }
        });
    });

    return { updatedTeams, weeklyResults };
};

export const getTeamStats = (teams: Team[]): TeamStats[] => {
    return teams.map(team => ({
        ...team,
        teamAverage: getTeamAverage(team)
    })).sort((a, b) => b.totalPoints - a.totalPoints);
};