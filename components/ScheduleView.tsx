import React, { useState, useMemo } from 'react';
import { Team, ScheduleEntry, Bowler, LeagueState } from '../types';

interface ScheduleViewProps {
  teams: Team[];
  schedule: ScheduleEntry[];
  currentWeek: number;
  history: { [week: number]: LeagueState };
}

type MatchupInfo = {
    week: number;
    date: string;
    opponentName: string;
    lanes: string;
    result: { pointsWon: number; pointsLost: number; } | null;
    hasData: boolean;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ teams, schedule, currentWeek, history }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(teams[0]?.id || null);

  const selectedTeam = useMemo(() => {
    return teams.find(t => t.id === selectedTeamId);
  }, [selectedTeamId, teams]);
  
  const { futureMatchups, pastMatchups } = useMemo(() => {
    if (!selectedTeamId) return { futureMatchups: [], pastMatchups: [] };
    
    const allMatchups = schedule.map((week): MatchupInfo | null => {
        // Handle position rounds
        if (week.matchups.length === 0) {
            return {
                week: week.week,
                date: week.date,
                opponentName: 'Position Round',
                lanes: 'TBD',
                result: null,
                hasData: false,
            };
        }

        const matchup = week.matchups.find(m => m.team1Id === selectedTeamId || m.team2Id === selectedTeamId);
        if (!matchup) return null;
        
        const opponentId = matchup.team1Id === selectedTeamId ? matchup.team2Id : matchup.team1Id;
        const opponent = teams.find(t => t.id === opponentId);
        
        let result: { pointsWon: number, pointsLost: number } | null = null;
        const hasData = history[week.week] !== undefined;

        if (week.week <= currentWeek && hasData) {
            const weekResult = history[week.week]?.results.find(r => 
                (r.team1.id === selectedTeamId && r.team2.id === opponentId) ||
                (r.team2.id === selectedTeamId && r.team1.id === opponentId)
            );
            if (weekResult) {
                if (weekResult.team1.id === selectedTeamId) {
                    result = { pointsWon: weekResult.team1.pointsWon, pointsLost: weekResult.team2.pointsWon };
                } else {
                    result = { pointsWon: weekResult.team2.pointsWon, pointsLost: weekResult.team1.pointsWon };
                }
            }
        }

        return {
            week: week.week,
            date: week.date,
            opponentName: opponent ? opponent.name : 'Unknown',
            lanes: matchup.lanes.join(' & '),
            result: result,
            hasData: hasData,
        };

    }).filter((m): m is MatchupInfo => m !== null);
    
    const future = allMatchups.filter(m => m.week > currentWeek);
    const past = allMatchups.filter(m => m.week <= currentWeek);

    return { futureMatchups: future, pastMatchups: past };
  }, [selectedTeamId, schedule, teams, currentWeek, history]);
  
  const rosterMembers = selectedTeam?.bowlers.slice(0, 5) || [];
  const subs = selectedTeam?.bowlers.slice(5) || [];

  const BowlerCard: React.FC<{ bowler: Bowler }> = ({ bowler }) => (
    <li className="bg-brand-primary p-2 rounded-lg shadow flex justify-between items-center">
      <p className="font-semibold text-brand-text text-sm truncate" title={bowler.name}>{bowler.name}</p>
      <div className="flex items-center gap-3 text-xs text-brand-light font-mono whitespace-nowrap ml-2">
        <span>Avg:<span className="text-brand-gold font-bold ml-1">{bowler.average}</span></span>
        <span>Pins:<span className="font-bold ml-1">{bowler.totalPins.toLocaleString()}</span></span>
        <span>Games:<span className="font-bold ml-1">{bowler.gamesBowled}</span></span>
      </div>
    </li>
  );

  const MatchupCard: React.FC<{ match: MatchupInfo }> = ({ match }) => (
    <div className="bg-brand-primary p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex-1 mb-2 sm:mb-0">
        <p className="font-bold text-brand-gold">Week {match.week} <span className="text-sm font-normal text-brand-light ml-2">{new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span></p>
        <p>vs. {match.opponentName}</p>
        {match.result ? (
            <p className={`text-sm font-semibold mt-1 ${match.result.pointsWon > match.result.pointsLost ? 'text-green-400' : match.result.pointsWon < match.result.pointsLost ? 'text-red-400' : 'text-gray-400'}`}>
                Result: {match.result.pointsWon > match.result.pointsLost ? 'Win' : match.result.pointsWon < match.result.pointsLost ? 'Loss' : 'Tie'} {match.result.pointsWon.toFixed(1)} - {match.result.pointsLost.toFixed(1)}
            </p>
        ) : (
            match.week <= currentWeek && !match.hasData && <p className="text-xs text-gray-500 mt-1 italic">Result data not available for this week.</p>
        )}
      </div>
      <div className="bg-brand-accent text-sm font-semibold px-3 py-1 rounded-full">
        Lanes: {match.lanes}
      </div>
    </div>
  );

  return (
    <div className="bg-brand-secondary p-4 md:p-6 rounded-lg shadow-2xl">
      <h2 className="text-2xl font-bold mb-4 text-brand-gold">Team Schedule</h2>
      <div className="mb-6">
        <select
          value={selectedTeamId || ''}
          onChange={(e) => setSelectedTeamId(Number(e.target.value))}
          className="w-full p-2 rounded bg-brand-primary border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-gold"
        >
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>

      {selectedTeam && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 border-b border-brand-accent pb-2">{selectedTeam.name} Roster</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Roster Members Column */}
              <div>
                <h4 className="text-lg font-semibold text-brand-light mb-2">Roster Members</h4>
                <ul className="space-y-2">
                  {rosterMembers.map(bowler => <BowlerCard key={bowler.id} bowler={bowler} />)}
                </ul>
              </div>
              {/* Subs Column */}
              <div>
                {subs.length > 0 && (
                  <>
                    <h4 className="text-lg font-semibold text-brand-light mb-2">Subs</h4>
                    <ul className="space-y-2">
                      {subs.map(bowler => <BowlerCard key={bowler.id} bowler={bowler} />)}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Upcoming Schedule</h3>
            <div className="space-y-3">
              {futureMatchups.length > 0 ? (
                futureMatchups.map(match => <MatchupCard key={match.week} match={match} />)
              ) : (
                <div className="bg-brand-primary p-3 rounded-lg text-brand-light">
                  No upcoming matchups.
                </div>
              )}
            </div>

            {pastMatchups.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">Completed Matchups</h3>
                <div className="space-y-3">
                    {pastMatchups.map(match => <MatchupCard key={match.week} match={match} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;