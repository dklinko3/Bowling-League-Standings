import React, { useState } from 'react';
import { WeeklyMatchupResult } from '../types';
import { SortDownIcon, SortUpIcon } from './Icons';

interface WeeklyResultsViewProps {
  results: WeeklyMatchupResult[];
  week: number;
}

const WeeklyResultsView: React.FC<WeeklyResultsViewProps> = ({ results, week }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="bg-brand-secondary p-4 md:p-6 rounded-lg shadow-2xl mt-6">
      <button
        className="w-full flex justify-between items-center text-left text-2xl font-bold mb-4 text-brand-gold"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
        aria-controls="weekly-results-content"
      >
        <span>Week {week} Results</span>
        {isCollapsed ? <SortDownIcon className="h-6 w-6" /> : <SortUpIcon className="h-6 w-6" />}
      </button>
      {!isCollapsed && (
        <div id="weekly-results-content" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {results.map((matchup, index) => (
            <div key={index} className="bg-brand-primary p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-brand-light border-b border-brand-accent pb-2">
                Lanes {matchup.lanes.join(' & ')}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-brand-light">
                      <th className="py-1 pr-2">Team</th>
                      <th className="py-1 px-2 text-center">G1</th>
                      <th className="py-1 px-2 text-center">G2</th>
                      <th className="py-1 px-2 text-center">G3</th>
                      <th className="py-1 px-2 text-center font-bold">Total</th>
                      <th className="py-1 pl-2 text-center text-brand-gold">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-brand-accent/50">
                      <td className="py-1 pr-2 font-semibold">{matchup.team1.name}</td>
                      <td className="py-1 px-2 text-center">{matchup.team1.gameScores[0]}</td>
                      <td className="py-1 px-2 text-center">{matchup.team1.gameScores[1]}</td>
                      <td className="py-1 px-2 text-center">{matchup.team1.gameScores[2]}</td>
                      <td className="py-1 px-2 text-center font-bold">{matchup.team1.seriesScore}</td>
                      <td className="py-1 pl-2 text-center font-bold text-brand-gold">{matchup.team1.pointsWon}</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-2 font-semibold">{matchup.team2.name}</td>
                      <td className="py-1 px-2 text-center">{matchup.team2.gameScores[0]}</td>
                      <td className="py-1 px-2 text-center">{matchup.team2.gameScores[1]}</td>
                      <td className="py-1 px-2 text-center">{matchup.team2.gameScores[2]}</td>
                      <td className="py-1 px-2 text-center font-bold">{matchup.team2.seriesScore}</td>
                      <td className="py-1 pl-2 text-center font-bold text-brand-gold">{matchup.team2.pointsWon}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyResultsView;