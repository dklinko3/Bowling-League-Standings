import React, { useState, useMemo, useEffect } from 'react';
import { Team, Bowler, ScheduleEntry, WeeklyScores, GameScore } from '../types';

interface LeagueManagerProps {
    teams: Team[];
    onTeamUpdate: (updatedTeam: Team) => void;
    latestSimulatedWeek: number;
    schedule: ScheduleEntry[];
    onApplyScores: (weekNumber: number, weeklyScores: WeeklyScores) => void;
}

const LeagueManager: React.FC<LeagueManagerProps> = ({ teams, onTeamUpdate, latestSimulatedWeek, schedule, onApplyScores }) => {
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(teams.length > 0 ? teams[0].id : null);
    
    // Only allow scoring for the week immediately following the last simulated one.
    const weekToScore = latestSimulatedWeek + 1;

    const selectedTeam = useMemo(() => teams.find(t => t.id === selectedTeamId), [teams, selectedTeamId]);
    
    const [weeklyScores, setWeeklyScores] = useState<WeeklyScores | null>(null);

    useEffect(() => {
        if (weekToScore > schedule.length) {
            setWeeklyScores(null);
            return;
        }

        const weekSchedule = schedule.find(s => s.week === weekToScore);
        if (weekSchedule && teams.length > 0) {
            const participatingTeamIds = new Set<number>();
            weekSchedule.matchups.forEach(m => {
                participatingTeamIds.add(m.team1Id);
                participatingTeamIds.add(m.team2Id);
            });

            const teamScores = Array.from(participatingTeamIds).map(teamId => {
                const team = teams.find(t => t.id === teamId);
                const bowlerScores: GameScore[] = team ? team.bowlers.map(b => ({
                    bowlerId: b.id,
                    scores: [0, 0, 0] as [number, number, number]
                })) : [];
                return { teamId, bowlerScores };
            });

            setWeeklyScores({ week: weekToScore, teamScores });
        } else {
            setWeeklyScores(null);
        }
    }, [weekToScore, teams, schedule]);

    const handleScoreChange = (teamId: number, bowlerId: number, gameIndex: number, scoreStr: string) => {
        const score = parseInt(scoreStr, 10);
        
        setWeeklyScores(prevScores => {
            if (!prevScores) return null;

            const newScores = JSON.parse(JSON.stringify(prevScores)); // Deep copy for safety
            
            const teamScore = newScores.teamScores.find((ts: {teamId: number}) => ts.teamId === teamId);
            if (teamScore) {
                const bowlerScore = teamScore.bowlerScores.find((bs: {bowlerId: number}) => bs.bowlerId === bowlerId);
                if (bowlerScore) {
                    bowlerScore.scores[gameIndex] = isNaN(score) ? 0 : Math.max(0, Math.min(300, score));
                }
            }
            return newScores;
        });
    };
    
    const handleApplyScoresClick = () => {
        if (weeklyScores) {
            // A simple validation to ensure scores have been entered
            const allScoresZero = weeklyScores.teamScores.every(ts => 
                ts.bowlerScores.every(bs => bs.scores.every(s => s === 0))
            );
            if (allScoresZero) {
                if(!window.confirm("All scores are zero. Do you want to proceed?")) {
                    return;
                }
            }
            onApplyScores(weekToScore, weeklyScores);
        }
    };
    
    const handleBowlerUpdate = (bowlerId: number, field: keyof Bowler, value: string | number) => {
        if (!selectedTeam) return;

        const updatedBowlers = selectedTeam.bowlers.map(b => {
            if (b.id === bowlerId) {
                const updatedValue = field === 'average' ? (Number.isNaN(parseInt(value as string)) ? 0 : parseInt(value as string, 10)) : value;
                return { ...b, [field]: updatedValue };
            }
            return b;
        });

        const updatedTeam = { ...selectedTeam, bowlers: updatedBowlers };
        onTeamUpdate(updatedTeam);
    };

    // Auto-select first team if current selection is invalid
    useEffect(() => {
        if (!selectedTeamId && teams.length > 0) {
            setSelectedTeamId(teams[0].id);
        }
    }, [teams, selectedTeamId]);


    return (
        <div className="bg-brand-secondary p-4 md:p-6 rounded-lg shadow-2xl space-y-8">
            {/* Team Roster Management Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4 text-brand-gold">Roster Management</h2>
                <select
                    value={selectedTeamId || ''}
                    onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                    className="w-full md:w-1/2 p-2 rounded bg-brand-primary border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-gold mb-4"
                >
                    {teams.sort((a,b) => a.name.localeCompare(b.name)).map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>

                {selectedTeam && (
                    <div className="bg-brand-primary p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3 text-brand-light">{selectedTeam.name}</h3>
                        <div className="space-y-2">
                            {selectedTeam.bowlers.map(bowler => (
                                <div key={bowler.id} className="flex flex-col md:flex-row items-center gap-2 p-2 bg-brand-secondary/50 rounded">
                                    <input 
                                        type="text"
                                        value={bowler.name}
                                        onChange={e => handleBowlerUpdate(bowler.id, 'name', e.target.value)}
                                        className="bg-brand-primary p-1 rounded border border-brand-accent w-full md:w-2/3"
                                    />
                                    <div className="flex gap-2 items-center w-full md:w-1/3">
                                       <label htmlFor={`avg-${bowler.id}`} className="text-sm">Book Avg:</label>
                                       <input 
                                         id={`avg-${bowler.id}`}
                                         type="number"
                                         value={bowler.average}
                                         onChange={e => handleBowlerUpdate(bowler.id, 'average', e.target.value)}
                                         className="bg-brand-primary p-1 rounded border border-brand-accent w-full"
                                       />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Weekly Score Entry Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4 text-brand-gold">Score Entry for Week {weekToScore}</h2>
                
                {weekToScore > 34 ? (
                     <p className="text-brand-light italic">Season is over. No more scores to enter.</p>
                ) : weeklyScores && schedule.find(s => s.week === weekToScore)?.matchups.length > 0 ? (
                    <div className="space-y-6">
                        {schedule.find(s => s.week === weekToScore)?.matchups.map(matchup => (
                             <div key={`${matchup.team1Id}-${matchup.team2Id}`} className="bg-brand-primary p-4 rounded-lg">
                                <h4 className="font-bold text-brand-light border-b border-brand-accent pb-2 mb-2">
                                    Lanes {matchup.lanes.join(' & ')}: {teams.find(t => t.id === matchup.team1Id)?.name} vs {teams.find(t => t.id === matchup.team2Id)?.name}
                                </h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                     {[matchup.team1Id, matchup.team2Id].map(teamId => (
                                        <div key={teamId}>
                                            <h5 className="font-semibold mb-2">{teams.find(t => t.id === teamId)?.name}</h5>
                                            {teams.find(t => t.id === teamId)?.bowlers.slice(0, 5).map(bowler => ( // only show 5 bowlers for scoring
                                                <div key={bowler.id} className="flex items-center gap-2 mb-1">
                                                    <span className="w-2/5 truncate text-sm" title={bowler.name}>{bowler.name}</span>
                                                    {[0, 1, 2].map(gameIndex => (
                                                        <input
                                                            key={gameIndex}
                                                            type="number"
                                                            min="0" max="300"
                                                            className="w-16 p-1 bg-brand-secondary/50 rounded text-center"
                                                            value={weeklyScores.teamScores.find(ts => ts.teamId === teamId)?.bowlerScores.find(bs => bs.bowlerId === bowler.id)?.scores[gameIndex] || 0}
                                                            onChange={e => handleScoreChange(teamId, bowler.id, gameIndex, e.target.value)}
                                                        />
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                     ))}
                                </div>
                             </div>
                        ))}
                        <button
                            onClick={handleApplyScoresClick}
                            className="w-full mt-4 px-6 py-3 bg-green-600/90 hover:bg-green-500 rounded-md font-bold text-lg transition-colors duration-200"
                        >
                            Apply Week {weekToScore} Scores & Finalize
                        </button>
                    </div>
                ) : (
                    <p className="text-brand-light italic">
                      Week {weekToScore} is a position round. Scores are not entered manually here. Use simulation.
                    </p>
                )}
            </div>
        </div>
    );
};

export default LeagueManager;
