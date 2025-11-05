// Fix: Implement the LeagueManager component which was previously a placeholder.
import React, { useState, useEffect } from 'react';
import { Team, Bowler, ScheduleEntry, WeeklyScores, GameScore } from '../types';

interface LeagueManagerProps {
  teams: Team[];
  onTeamUpdate: (updatedTeam: Team) => void;
  latestSimulatedWeek: number;
  schedule: ScheduleEntry[];
  onApplyScores: (weekNumber: number, weeklyScores: WeeklyScores) => void;
}

const LeagueManager: React.FC<LeagueManagerProps> = ({ teams, onTeamUpdate, latestSimulatedWeek, schedule, onApplyScores }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(teams[0]?.id || null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rosterGenError, setRosterGenError] = useState('');

  // When selectedTeamId changes, find the corresponding team data
  useEffect(() => {
    const team = teams.find(t => t.id === selectedTeamId);
    setSelectedTeam(team ? { ...team } : null);
  }, [selectedTeamId, teams]);
  
  const handleBowlerChange = (bowlerId: number, field: keyof Bowler, value: string | number) => {
    if (!selectedTeam) return;

    const updatedBowlers = selectedTeam.bowlers.map(b => {
      if (b.id === bowlerId) {
        return { ...b, [field]: value };
      }
      return b;
    });

    const updatedTeam = { ...selectedTeam, bowlers: updatedBowlers };
    setSelectedTeam(updatedTeam);
    onTeamUpdate(updatedTeam);
  };
  
  const handleAddBowler = () => {
    if (!selectedTeam) return;

    const newBowler: Bowler = {
      id: Date.now(), // temporary unique ID
      name: 'New Bowler',
      average: 150,
      totalPins: 0,
      gamesBowled: 0,
    };
    
    const updatedTeam = { ...selectedTeam, bowlers: [...selectedTeam.bowlers, newBowler] };
    setSelectedTeam(updatedTeam);
    onTeamUpdate(updatedTeam);
  };
  
  const handleRemoveBowler = (bowlerId: number) => {
    if(!selectedTeam) return;

    const updatedTeam = { ...selectedTeam, bowlers: selectedTeam.bowlers.filter(b => b.id !== bowlerId) };
    setSelectedTeam(updatedTeam);
    onTeamUpdate(updatedTeam);
  };
  
  const generateRoster = async () => {
    if (!selectedTeam) return;
    setIsLoading(true);
    setRosterGenError('');

    try {
        const response = await fetch('/api/generate-roster', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamName: selectedTeam.name, bowlerCount: 7 }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate roster.');
        }

        const data = await response.json();
        
        const newBowlers: Bowler[] = data.bowlers.map((b: {name: string, average: number}, index: number) => ({
            id: Date.now() + index, // temporary unique ID
            name: b.name,
            average: b.average,
            totalPins: 0,
            gamesBowled: 0
        }));

        const updatedTeam = { ...selectedTeam, bowlers: newBowlers };
        setSelectedTeam(updatedTeam);
        onTeamUpdate(updatedTeam);

    } catch (error) {
        setRosterGenError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };


  const nextWeek = latestSimulatedWeek + 1;
  const nextWeekSchedule = schedule.find(s => s.week === nextWeek);

  const [scores, setScores] = useState<WeeklyScores | null>(null);

  useEffect(() => {
    if (nextWeekSchedule) {
      const teamIdsInMatchups = new Set<number>();
      nextWeekSchedule.matchups.forEach(m => {
        teamIdsInMatchups.add(m.team1Id);
        teamIdsInMatchups.add(m.team2Id);
      });
      
      const newScores: WeeklyScores = {
        week: nextWeek,
        teamScores: [],
      };

      teams.forEach(team => {
        if(teamIdsInMatchups.has(team.id)){
            const bowlerScores: GameScore[] = team.bowlers.map(b => ({
                bowlerId: b.id,
                scores: [0, 0, 0]
            }));
            newScores.teamScores.push({ teamId: team.id, bowlerScores });
        }
      });
      setScores(newScores);
    } else {
        setScores(null);
    }
  }, [latestSimulatedWeek, schedule, teams, nextWeekSchedule, nextWeek]);


  const handleScoreChange = (teamId: number, bowlerId: number, gameIndex: number, scoreValue: string) => {
    if (!scores) return;

    const score = parseInt(scoreValue, 10);

    const newTeamScores = scores.teamScores.map(ts => {
      if (ts.teamId === teamId) {
        const newBowlerScores = ts.bowlerScores.map(bs => {
          if (bs.bowlerId === bowlerId) {
            const newScores = [...bs.scores] as [number, number, number];
            newScores[gameIndex] = isNaN(score) ? 0 : score;
            return { ...bs, scores: newScores };
          }
          return bs;
        });
        return { ...ts, bowlerScores: newBowlerScores };
      }
      return ts;
    });

    setScores({ ...scores, teamScores: newTeamScores });
  };
  
  const submitScores = () => {
    if (scores) {
        onApplyScores(nextWeek, scores);
    }
  };


  return (
    <div className="bg-brand-secondary p-4 md:p-6 rounded-lg shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Team & Roster Management */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-brand-gold">Roster Management</h2>
        <div className="mb-4">
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
          <div className="bg-brand-primary p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">{selectedTeam.name}</h3>
            <div className="space-y-2">
              {selectedTeam.bowlers.map(bowler => (
                <div key={bowler.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bowler.name}
                    onChange={(e) => handleBowlerChange(bowler.id, 'name', e.target.value)}
                    className="flex-grow p-1 rounded bg-brand-secondary border border-brand-accent text-sm"
                  />
                  <input
                    type="number"
                    value={bowler.average}
                    onChange={(e) => handleBowlerChange(bowler.id, 'average', Number(e.target.value))}
                    className="w-20 p-1 rounded bg-brand-secondary border border-brand-accent text-sm"
                  />
                  <button onClick={() => handleRemoveBowler(bowler.id)} className="text-red-500 hover:text-red-400 p-1">✕</button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleAddBowler} className="px-3 py-1 bg-brand-accent hover:bg-brand-light hover:text-brand-primary rounded-md text-sm">Add Bowler</button>
              <button onClick={generateRoster} disabled={isLoading} className="px-3 py-1 bg-brand-gold text-brand-primary hover:opacity-90 rounded-md text-sm font-semibold disabled:bg-gray-500 disabled:cursor-wait">
                {isLoading ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
            {rosterGenError && <p className="text-red-500 text-sm mt-2">{rosterGenError}</p>}
          </div>
        )}
      </div>

      {/* Weekly Score Entry */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-brand-gold">Enter Scores for Week {nextWeek}</h2>
        {nextWeek > 34 ? (
            <p className="text-brand-light">Season is over.</p>
        ) : !nextWeekSchedule || nextWeekSchedule.matchups.length === 0 ? (
            <p className="text-brand-light">Next week is a position round. Scores are not entered here.</p>
        ) : (
          <div className="bg-brand-primary p-4 rounded-lg space-y-4 max-h-[600px] overflow-y-auto">
             {nextWeekSchedule.matchups.map(matchup => (
                 <div key={`${matchup.team1Id}-${matchup.team2Id}`}>
                     <h4 className="font-semibold text-brand-light border-b border-brand-accent pb-1 mb-2">Lanes {matchup.lanes.join(' & ')}</h4>
                     {[matchup.team1Id, matchup.team2Id].map(teamId => {
                         const team = teams.find(t => t.id === teamId);
                         const teamScore = scores?.teamScores.find(ts => ts.teamId === teamId);
                         if (!team || !teamScore) return null;

                         return (
                            <div key={team.id} className="mb-3">
                                <p className="font-bold">{team.name}</p>
                                <div className="text-xs space-y-1 mt-1">
                                    {team.bowlers.map(bowler => {
                                        const bowlerScore = teamScore.bowlerScores.find(bs => bs.bowlerId === bowler.id);
                                        return (
                                            <div key={bowler.id} className="grid grid-cols-4 gap-2 items-center">
                                                <span className="truncate" title={bowler.name}>{bowler.name}</span>
                                                {[0, 1, 2].map(gameIndex => (
                                                    <input
                                                        key={gameIndex}
                                                        type="number"
                                                        min="0" max="300"
                                                        value={bowlerScore?.scores[gameIndex] || 0}
                                                        onChange={(e) => handleScoreChange(team.id, bowler.id, gameIndex, e.target.value)}
                                                        className="w-full p-1 rounded bg-brand-secondary border border-brand-accent text-center"
                                                     />
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                         )
                     })}
                 </div>
             ))}
             <button onClick={submitScores} className="w-full mt-4 px-4 py-2 bg-green-600/90 hover:bg-green-500 rounded-md font-semibold transition-colors duration-200">Apply Scores for Week {nextWeek}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueManager;
