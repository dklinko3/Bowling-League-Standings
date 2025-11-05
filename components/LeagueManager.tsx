import React, { useState, useMemo, useEffect } from 'react';
import { Team, Bowler, ScheduleEntry, WeeklyScores, GameScore } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface LeagueManagerProps {
  teams: Team[];
  onTeamUpdate: (team: Team) => void;
  latestSimulatedWeek: number;
  schedule: ScheduleEntry[];
  onApplyScores: (weekNumber: number, weeklyScores: WeeklyScores) => void;
}

interface ParsedScores {
    teamScores: {
        teamName: string;
        bowlerScores: {
            bowlerName: string;
            scores: [number, number, number];
        }[];
    }[];
}

const LeagueManager: React.FC<LeagueManagerProps> = ({ teams, onTeamUpdate, latestSimulatedWeek, schedule, onApplyScores }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(teams[0]?.id || null);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);
  const [rosterError, setRosterError] = useState<string | null>(null);

  const [isProcessingScores, setIsProcessingScores] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [parsedScores, setParsedScores] = useState<ParsedScores | null>(null);
  
  const nextWeek = latestSimulatedWeek + 1;

  useEffect(() => {
    // Reset state when week changes
    setParsedScores(null);
    setProcessingError(null);
  }, [latestSimulatedWeek]);

  const sortedTeams = useMemo(() => [...teams].sort((a,b) => a.name.localeCompare(b.name)), [teams]);

  const selectedTeam = useMemo(() => {
    return teams.find(t => t.id === selectedTeamId);
  }, [selectedTeamId, teams]);
  
  const handleGenerateBowlers = async () => {
    if (!selectedTeam) return;
    setIsLoadingRoster(true);
    setRosterError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate ${selectedTeam.bowlers.length} realistic names and bowling averages for a men's league bowling team named "${selectedTeam.name}". The averages should be between 150 and 230.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    bowlers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, average: { type: Type.INTEGER } }}},
                },
            },
        },
      });
      const jsonResponse = JSON.parse(response.text);
      if (jsonResponse.bowlers && jsonResponse.bowlers.length === selectedTeam.bowlers.length) {
          const newBowlers: Bowler[] = jsonResponse.bowlers.map((b: {name: string, average: number}, index: number) => ({...selectedTeam.bowlers[index], name: b.name, average: b.average}));
          const updatedTeam = { ...selectedTeam, bowlers: newBowlers };
          onTeamUpdate(updatedTeam);
      } else { throw new Error("AI response was not in the expected format.");}
    } catch (e) {
      console.error(e);
      setRosterError("Failed to generate bowlers. Please try again.");
    } finally { setIsLoadingRoster(false);}
  };

  const handleFetchScores = async () => {
    setIsProcessingScores(true);
    setProcessingError(null);
    setParsedScores(null);

    try {
      // This now calls the backend "helper program" (serverless function).
      // The '/api/fetch-scores' endpoint must be set up on a hosting platform
      // to run the helper code I provided.
      const response = await fetch('/api/fetch-scores');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `The score fetching service returned an error: ${response.statusText}`);
      }

      const scores: ParsedScores = await response.json();

      // Filter out teams that might have been hallucinated by the model
      const validTeams = new Set(teams.map(t => t.name));
      scores.teamScores = scores.teamScores.filter((ts: any) => validTeams.has(ts.teamName));
      
      setParsedScores(scores);

    } catch (e) {
      console.error(e);
      setProcessingError((e as Error).message || "An error occurred while fetching the scores. Make sure the backend helper is running.");
    } finally {
      setIsProcessingScores(false);
    }
  };

  const handleConfirmScores = () => {
    if (!parsedScores) return;

    try {
        const weeklyScores: WeeklyScores = {
            week: nextWeek,
            teamScores: parsedScores.teamScores.map(parsedTeam => {
                const team = teams.find(t => t.name === parsedTeam.teamName);
                if (!team) {
                    console.warn(`Could not find team with name: ${parsedTeam.teamName}`);
                    return null;
                }
                
                const bowlerScores: GameScore[] = parsedTeam.bowlerScores.map(parsedBowler => {
                    const bowler = team.bowlers.find(b => b.name === parsedBowler.bowlerName);
                    if (!bowler) {
                         console.warn(`Could not find bowler "${parsedBowler.bowlerName}" in team "${team.name}"`);
                        return null;
                    }
                    if (parsedBowler.scores.length !== 3) {
                        console.warn(`Bowler "${parsedBowler.bowlerName}" does not have 3 scores.`);
                        return null;
                    }
                    return {
                        bowlerId: bowler.id,
                        scores: parsedBowler.scores as [number, number, number]
                    };
                }).filter((bs): bs is GameScore => bs !== null);
                
                // Make sure all bowlers from the roster are accounted for, even if absent
                team.bowlers.forEach(rosterBowler => {
                    if (!bowlerScores.find(bs => bs.bowlerId === rosterBowler.id)) {
                        bowlerScores.push({ bowlerId: rosterBowler.id, scores: [0, 0, 0] });
                    }
                });

                return { teamId: team.id, bowlerScores };
            }).filter((ts): ts is {teamId: number, bowlerScores: GameScore[]} => ts !== null && ts.bowlerScores.length > 0)
        };
        
        if (weeklyScores.teamScores.length === 0) {
            throw new Error("Score parsing resulted in no valid team scores. Please try fetching again.");
        }

        onApplyScores(nextWeek, weeklyScores);
        setParsedScores(null);
    } catch (e) {
        console.error(e);
        setProcessingError((e as Error).message || "An error occurred while applying scores.");
    }
  };

  return (
    <div className="bg-brand-secondary p-4 md:p-6 rounded-lg shadow-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-brand-gold">Roster Management</h2>
        <div className="mb-6 max-w-md">
          <label htmlFor="team-select" className="block text-sm font-medium text-brand-light mb-1">Select Team</label>
          <select id="team-select" value={selectedTeamId || ''} onChange={(e) => setSelectedTeamId(Number(e.target.value))} className="w-full p-2 rounded bg-brand-primary border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-gold">
            {sortedTeams.map(team => (<option key={team.id} value={team.id}>{team.name}</option>))}
          </select>
        </div>
        {selectedTeam && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Manage Roster for: {selectedTeam.name}</h3>
            <div className="bg-brand-primary p-4 rounded-lg">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {selectedTeam.bowlers.map(bowler => ( <li key={bowler.id} className="bg-brand-secondary p-3 rounded flex justify-between items-center"> <span className="font-semibold">{bowler.name}</span> <span className="font-mono text-brand-light bg-brand-accent px-2 py-1 rounded-md text-sm">{bowler.average} avg</span></li>))}
              </ul>
              <div className="border-t border-brand-accent pt-4">
                   <p className="text-sm text-brand-light mb-2">Need more realistic data? Let AI generate a new roster.</p>
                  <button onClick={handleGenerateBowlers} disabled={isLoadingRoster} className="px-4 py-2 bg-brand-gold text-brand-primary rounded-md font-bold hover:bg-yellow-300 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-wait">
                      {isLoadingRoster ? 'Generating Roster...' : 'Generate Realistic Roster with AI'}
                  </button>
                   {rosterError && <p className="text-red-400 mt-2 text-sm">{rosterError}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t-2 border-brand-accent/50 pt-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-gold">Live Score Update for Week {nextWeek}</h2>
        <div className="bg-brand-primary p-4 rounded-lg">
            <div className="mb-4">
              <p className="text-brand-light mb-2">Click the button below to automatically fetch and process the latest scores for the upcoming week.</p>
              <button onClick={handleFetchScores} disabled={isProcessingScores || nextWeek > 34} className="px-4 py-2 bg-blue-500 text-white rounded-md font-bold hover:bg-blue-400 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isProcessingScores ? `Fetching Scores...` : `Fetch Week ${nextWeek} Scores`}
            </button>
            </div>
            
            {processingError && <p className="text-red-400 mt-4 text-sm">{processingError}</p>}
            
            {parsedScores && (
                <div className="mt-4 border-t border-brand-accent pt-4 space-y-4">
                    <div>
                        <h4 className="font-semibold text-brand-light mb-2">Fetched Scores (Review before applying):</h4>
                        <div className="bg-brand-secondary p-3 rounded-md max-h-60 overflow-y-auto">
                            <ul className="text-xs font-mono space-y-2">
                                {parsedScores.teamScores.map(ts => (
                                    <li key={ts.teamName}>
                                        <p className="font-bold text-brand-gold">{ts.teamName}</p>
                                        <ul className="pl-4">
                                            {ts.bowlerScores.map(bs => (
                                                <li key={bs.bowlerName}>{bs.bowlerName}: [{bs.scores.join(', ')}]</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <button onClick={handleConfirmScores} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md font-bold hover:bg-green-500 transition-colors duration-200">
                            Confirm & Apply Scores
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LeagueManager;