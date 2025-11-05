import React, { useState, useEffect, useMemo } from 'react';
import { Team, TeamStats, ScheduleEntry, WeeklyMatchupResult, WeeklyScores, LeagueState } from './types';
import { initialTeams, leagueSchedule, generateWeeklyScores, week9Results } from './services/mockData';
import { processWeekScores, getTeamStats } from './services/leagueService';
import StandingsTable from './components/StandingsTable';
import ScheduleView from './components/ScheduleView';
import WeeklyResultsView from './components/WeeklyResultsView';
import LeagueManager from './components/LeagueManager';
import { BowlingPinIcon, CalendarIcon, TrophyIcon, CogIcon } from './components/Icons';

type View = 'standings' | 'schedule' | 'manager';

const App: React.FC = () => {
    const [history, setHistory] = useState<{ [week: number]: LeagueState }>({
        9: { teams: initialTeams, results: week9Results }
    });
    const [latestSimulatedWeek, setLatestSimulatedWeek] = useState(9);
    const [viewWeek, setViewWeek] = useState(9);
    const [activeView, setActiveView] = useState<View>('standings');

    const displayedState = useMemo(() => history[viewWeek], [history, viewWeek]);
    const teamStats = useMemo(() => getTeamStats(displayedState.teams), [displayedState.teams]);

    const simulateNextWeek = () => {
        const nextWeek = latestSimulatedWeek + 1;
        if (nextWeek > leagueSchedule.length) {
            alert("Season is over!");
            return;
        }

        const previousWeekState = history[latestSimulatedWeek];
        const weeklyScores = generateWeeklyScores(nextWeek, previousWeekState.teams, leagueSchedule);
        const { updatedTeams, weeklyResults } = processWeekScores(previousWeekState.teams, weeklyScores, leagueSchedule);
        
        setHistory(prevHistory => ({
            ...prevHistory,
            [nextWeek]: { teams: updatedTeams, results: weeklyResults }
        }));
        setLatestSimulatedWeek(nextWeek);
        setViewWeek(nextWeek);
    };
    
    const handleApplyScores = (weekNumber: number, weeklyScores: WeeklyScores) => {
        const previousWeekState = history[weekNumber - 1];
        if (!previousWeekState) {
            alert("Cannot apply scores, previous week's data is missing.");
            return;
        }
    
        const { updatedTeams, weeklyResults } = processWeekScores(previousWeekState.teams, weeklyScores, leagueSchedule);
        
        setHistory(prevHistory => ({
            ...prevHistory,
            [weekNumber]: { teams: updatedTeams, results: weeklyResults }
        }));
        setLatestSimulatedWeek(weekNumber);
        setViewWeek(weekNumber);
    };


    const resetLeague = () => {
        setHistory({ 9: { teams: initialTeams, results: week9Results } });
        setLatestSimulatedWeek(9);
        setViewWeek(9);
    }
    
    const handleTeamUpdate = (updatedTeam: Team) => {
        setHistory(prev => {
            const newHistory = {...prev};
            const currentWeekState = newHistory[latestSimulatedWeek];
            const updatedTeams = currentWeekState.teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
            newHistory[latestSimulatedWeek] = { ...currentWeekState, teams: updatedTeams };
            return newHistory;
        });
     };

    const NavButton: React.FC<{view: View, label: string, icon: React.ReactNode}> = ({view, label, icon}) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 w-full md:w-auto text-sm md:text-base ${activeView === view ? 'bg-brand-gold text-brand-primary font-bold shadow-lg' : 'bg-brand-accent hover:bg-brand-light hover:text-brand-primary'}`}
            aria-pressed={activeView === view}
        >
            {icon}
            {label}
        </button>
    );

    const renderView = () => {
        switch(activeView) {
            case 'standings':
                return (
                    <>
                        <StandingsTable teams={teamStats} schedule={leagueSchedule} currentWeek={latestSimulatedWeek} />
                        <WeeklyResultsView results={displayedState.results} week={viewWeek} />
                    </>
                );
            case 'schedule':
                return <ScheduleView teams={displayedState.teams} schedule={leagueSchedule} currentWeek={latestSimulatedWeek} history={history} />;
            case 'manager':
                return <LeagueManager 
                            teams={history[latestSimulatedWeek].teams} 
                            onTeamUpdate={handleTeamUpdate}
                            latestSimulatedWeek={latestSimulatedWeek}
                            schedule={leagueSchedule}
                            onApplyScores={handleApplyScores}
                        />;
            default:
                return <StandingsTable teams={teamStats} schedule={leagueSchedule} currentWeek={latestSimulatedWeek} />;
        }
    }

    return (
        <div className="min-h-screen bg-brand-primary font-sans">
            <header className="bg-brand-secondary p-4 shadow-md">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <BowlingPinIcon className="h-10 w-10 text-brand-gold" />
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-wider">Top Dawg Classic 2025-2026</h1>
                            <p className="text-sm text-brand-light">Del-High Point Bowling Center</p>
                        </div>
                    </div>
                    <nav className="flex gap-2 w-full md:w-auto">
                        <NavButton view="standings" label="Standings" icon={<TrophyIcon className="h-5 w-5"/>} />
                        <NavButton view="schedule" label="Schedule" icon={<CalendarIcon className="h-5 w-5"/>} />
                        <NavButton view="manager" label="League Manager" icon={<CogIcon className="h-5 w-5"/>} />
                    </nav>
                </div>
            </header>
            
            <main className="container mx-auto p-4 md:p-6">
                <div className="bg-brand-secondary p-4 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold">Week {viewWeek}</h2>
                        <div className="flex items-center gap-2">
                             <label htmlFor="week-selector" className="text-sm text-brand-light">View History:</label>
                             <select
                                id="week-selector"
                                value={viewWeek}
                                onChange={(e) => setViewWeek(Number(e.target.value))}
                                className="p-1 rounded bg-brand-primary border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm"
                            >
                                {Object.keys(history).map(weekNum => (
                                    <option key={weekNum} value={weekNum}>Week {weekNum}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={resetLeague} className="px-4 py-2 bg-red-600/80 hover:bg-red-500 rounded-md font-semibold transition-colors duration-200 text-sm">Reset Sim</button>
                        <button 
                          onClick={simulateNextWeek} 
                          disabled={latestSimulatedWeek >= 34}
                          className="px-4 py-2 bg-green-600/90 hover:bg-green-500 rounded-md font-semibold transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed text-sm"
                        >
                          Simulate Week {latestSimulatedWeek + 1}
                        </button>
                    </div>
                </div>

                {renderView()}

            </main>
            <footer className="text-center py-4 text-xs text-brand-accent">
                <p>&copy; {new Date().getFullYear()} Top Dawg Classic Bowling Manager. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;