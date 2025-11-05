import React, { useState, useMemo } from 'react';
import { TeamStats, ScheduleEntry } from '../types';
import { SortUpIcon, SortDownIcon } from './Icons';

interface StandingsTableProps {
  teams: TeamStats[];
  schedule: ScheduleEntry[];
  currentWeek: number;
}

type SortKey = 'name' | 'teamAverage' | 'firstHalfPoints' | 'secondHalfPoints' | 'totalPoints' | 'teamNumber' | 'totalScratchPins' | 'totalHdcpPins';
type SortDirection = 'asc' | 'desc';

const StandingsTable: React.FC<StandingsTableProps> = ({ teams, schedule, currentWeek }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'totalPoints', direction: 'desc' });
  const [isExpanded, setIsExpanded] = useState(false);

  const nextWeekSchedule = useMemo(() => {
    const nextWeek = currentWeek + 1;
    if (nextWeek > 34) return null;
    return schedule.find(s => s.week === nextWeek);
  }, [schedule, currentWeek]);

  const getNextMatchupInfo = (teamId: number): string => {
      if (!nextWeekSchedule) return "Season Over";

      if (nextWeekSchedule.matchups.length === 0) {
          return `Week ${nextWeekSchedule.week}: Position Round`;
      }

      const matchup = nextWeekSchedule.matchups.find(m => m.team1Id === teamId || m.team2Id === teamId);
      if (!matchup) return "—";

      const opponentId = matchup.team1Id === teamId ? matchup.team2Id : matchup.team1Id;
      const opponent = teams.find(t => t.id === opponentId);

      return `vs ${opponent ? opponent.name : 'Unknown'} (Lanes ${matchup.lanes.join(' & ')})`;
  };

  const sortedTeams = useMemo(() => {
    let teamsToSort = [...teams];

    if (sortConfig.key) {
      teamsToSort.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        
        // Tie-breaker for totalPoints
        if (sortConfig.key === 'totalPoints') {
          return a.totalPenalty - b.totalPenalty; // Lower penalty is better
        }
        
        return 0;
      });
    }

    return teamsToSort;
  }, [teams, sortConfig]);

  const displayedTeams = useMemo(() => {
    return isExpanded ? sortedTeams : sortedTeams.slice(0, 10);
  }, [sortedTeams, isExpanded]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === 'asc') return <SortUpIcon className="h-4 w-4 ml-1" />;
    return <SortDownIcon className="h-4 w-4 ml-1" />;
  };

  const SortableHeader: React.FC<{ sortKey: SortKey, children: React.ReactNode, className?: string}> = ({ sortKey, children, className }) => (
    <th className={`p-3 text-left cursor-pointer hover:bg-brand-accent ${className}`} onClick={() => requestSort(sortKey)}>
        <div className="flex items-center">{children} {getSortIcon(sortKey)}</div>
    </th>
  )

  return (
    <div className="bg-brand-secondary p-4 md:p-6 rounded-lg shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-brand-accent">
            <tr>
              <SortableHeader sortKey="teamNumber">Team #</SortableHeader>
              <th className="p-3 text-left" scope="col">Place</th>
              <SortableHeader sortKey="name">Team</SortableHeader>
              <SortableHeader sortKey="firstHalfPoints">1st Half</SortableHeader>
              <SortableHeader sortKey="teamAverage" className="hidden lg:table-cell">Avg</SortableHeader>
              <th className="p-3 text-left hidden xl:table-cell">Next Matchup</th>
              <SortableHeader sortKey="totalScratchPins" className="hidden lg:table-cell">Scratch</SortableHeader>
              <SortableHeader sortKey="totalHdcpPins" className="hidden md:table-cell">Total Pins</SortableHeader>
              <SortableHeader sortKey="secondHalfPoints">2nd Half</SortableHeader>
              <SortableHeader sortKey="totalPoints">Total</SortableHeader>
            </tr>
          </thead>
          <tbody>
            {displayedTeams.map((team, index) => (
              <tr key={team.id} className="border-b border-brand-accent hover:bg-brand-accent/50 transition-colors duration-150">
                <td className="p-3 text-center">{team.teamNumber}</td>
                <td className="p-3 font-bold text-brand-light">{index + 1}</td>
                <td className="p-3 font-semibold">{team.name}</td>
                <td className="p-3 text-center">{team.firstHalfPoints.toFixed(1)}</td>
                <td className="p-3 hidden lg:table-cell">{team.teamAverage}</td>
                <td className="p-3 hidden xl:table-cell text-xs">{getNextMatchupInfo(team.id)}</td>
                <td className="p-3 hidden lg:table-cell">{team.totalScratchPins.toLocaleString()}</td>
                <td className="p-3 hidden md:table-cell">{team.totalHdcpPins.toLocaleString()}</td>
                <td className="p-3 text-center">{team.secondHalfPoints.toFixed(1)}</td>
                <td className="p-3 text-center font-bold text-brand-gold">{team.totalPoints.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedTeams.length > 10 && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-2 bg-brand-accent hover:bg-brand-light hover:text-brand-primary rounded-md font-semibold transition-colors duration-200"
          >
            {isExpanded ? 'Show Top 10' : 'View All'}
          </button>
        </div>
      )}
    </div>
  );
};

export default StandingsTable;