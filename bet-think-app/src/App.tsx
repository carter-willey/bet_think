import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Clock, X } from 'lucide-react';

// Type definitions
interface Odds {
  bookmaker: string;
  moneyline: string;
  spread: string;
  total: string;
}

interface Game {
  id: number;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  bettingVolume: number;
  isLive: boolean;
  odds: Odds[];
  props?: string[];
}

const mockGames: Game[] = [
  {
    id: 1,
    sport: 'NFL',
    homeTeam: 'New York Giants',
    awayTeam: 'Dallas Cowboys',
    time: '2:00 PM ET',
    bettingVolume: 1500000,
    isLive: false,
    odds: [
      { bookmaker: 'FanDuel', moneyline: '+165', spread: '+3.5 (-110)', total: 'O 47.5 (-115)' },
      { bookmaker: 'DraftKings', moneyline: '+170', spread: '+3.5 (-108)', total: 'O 47.5 (-110)' },
      { bookmaker: 'BetMGM', moneyline: '+160', spread: '+3.5 (-115)', total: 'O 47 (-110)' },
    ],
    props: ['First TD Scorer', 'Total Passing Yards', 'Team Total Points', 'Quarter Results']
  },
  {
    id: 2,
    sport: 'NBA',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Boston Celtics',
    time: 'LIVE',
    bettingVolume: 950000,
    isLive: true,
    odds: [
      { bookmaker: 'BetRivers', moneyline: '-130', spread: '-2.5 (-110)', total: 'O 221.5 (-110)' },
      { bookmaker: 'Bovada', moneyline: '-135', spread: '-2.5 (-110)', total: 'O 222 (-112)' },
      { bookmaker: 'Fanatics', moneyline: '-125', spread: '-2.5 (-112)', total: 'O 221.5 (-108)' },
    ],
    props: ['Player Points', 'Rebounds', 'Assists', 'First Basket']
  },
  {
    id: 3,
    sport: 'UFC',
    homeTeam: 'Alexander Volkanovski',
    awayTeam: 'Yair Rodriguez',
    time: 'Tomorrow 9:00 PM ET',
    bettingVolume: 750000,
    isLive: false,
    odds: [
      { bookmaker: 'BetOnline.ag', moneyline: '-280', spread: 'N/A', total: 'O 2.5 (-175)' },
      { bookmaker: 'LowVig.ag', moneyline: '-285', spread: 'N/A', total: 'O 2.5 (-180)' },
      { bookmaker: 'MyBookie.ag', moneyline: '-275', spread: 'N/A', total: 'O 2.5 (-170)' },
    ],
    props: ['Method of Victory', 'Round Betting', 'Fight to Go Distance', 'Total Rounds']
  },
];

const sportOptions = ['All', 'NFL', 'NBA', 'MLB', 'NHL', 'Soccer', 'Tennis', 'UFC', 'Boxing'];

// Format betting volume
const formatBettingVolume = (volume: number) => {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}M`;
  }
  return `$${(volume / 1000).toFixed(0)}K`;
};

const App = () => {
  const [selectedSport, setSelectedSport] = useState('All');
  const [expandedGames, setExpandedGames] = useState<number[]>([]);
  const [showPropsFor, setShowPropsFor] = useState<number | null>(null);
  
  const filteredGames = selectedSport === 'All' 
    ? mockGames 
    : mockGames.filter(game => game.sport === selectedSport);
  
  const toggleExpand = (gameId: number) => {
    setExpandedGames(current => 
      current.includes(gameId) 
        ? current.filter(id => id !== gameId)
        : [...current, gameId]
    );
  };

  const toggleProps = (gameId: number) => {
    setShowPropsFor(current => current === gameId ? null : gameId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">BetCompare</h1>
          <p className="text-gray-400 mt-1">Find the best odds across multiple sportsbooks</p>
        </div>
      </header>

      {/* Sport Filter */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sportOptions.map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  selectedSport === sport
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          Popular Games
        </h2>

        <div className="space-y-4">
          {filteredGames.map(game => (
            <div 
              key={game.id} 
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors duration-200"
            >
              {/* Game Header */}
              <div 
                onClick={() => toggleExpand(game.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-750"
              >
                <div className="flex items-center space-x-4">
                  <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {game.sport}
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {game.awayTeam} @ {game.homeTeam}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      {game.isLive ? (
                        <span className="flex items-center gap-1 text-red-500 animate-pulse">
                          <Clock className="w-4 h-4" />
                          LIVE
                        </span>
                      ) : (
                        <span>{game.time}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {formatBettingVolume(game.bettingVolume)} in bets
                      </span>
                    </div>
                  </div>
                </div>
                {expandedGames.includes(game.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Expanded Odds */}
              {expandedGames.includes(game.id) && (
                <div className="border-t border-gray-700 p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm">
                      <thead>
                        <tr className="text-gray-400">
                          <th className="text-left pb-2 pr-4">Sportsbook</th>
                          <th className="text-center pb-2 px-4">Moneyline</th>
                          <th className="text-center pb-2 px-4">Spread</th>
                          <th className="text-center pb-2 px-4">Total</th>
                          <th className="text-right pb-2 pl-4">Bet Now</th>
                        </tr>
                      </thead>
                      <tbody>
                        {game.odds.map((odd, index) => (
                          <tr key={index} className="border-t border-gray-700">
                            <td className="py-3 pr-4">{odd.bookmaker}</td>
                            <td className="text-center px-4">{odd.moneyline}</td>
                            <td className="text-center px-4">{odd.spread}</td>
                            <td className="text-center px-4">{odd.total}</td>
                            <td className="text-right pl-4">
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition-colors duration-200">
                                Bet
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Props Button */}
                  {game.props && game.props.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleProps(game.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors duration-200"
                      >
                        View {game.props.length} prop bets
                        {showPropsFor === game.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      
                      {showPropsFor === game.id && (
                        <div className="mt-3 p-4 bg-gray-900 rounded-lg animate-in fade-in duration-200">
                          <div className="flex flex-wrap gap-2">
                            {game.props.map((prop, i) => (
                              <span 
                                key={i}
                                className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                              >
                                {prop}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-3">About Us</h4>
              <p className="text-sm text-gray-400">
                Compare sports betting odds across multiple platforms to find the best value.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Sportsbooks</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="hover:text-gray-300 cursor-pointer">FanDuel</li>
                <li className="hover:text-gray-300 cursor-pointer">DraftKings</li>
                <li className="hover:text-gray-300 cursor-pointer">BetMGM</li>
                <li className="hover:text-gray-300 cursor-pointer">BetRivers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="hover:text-gray-300 cursor-pointer">How to Compare Odds</li>
                <li className="hover:text-gray-300 cursor-pointer">Betting Glossary</li>
                <li className="hover:text-gray-300 cursor-pointer">Responsible Gambling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="hover:text-gray-300 cursor-pointer">Terms of Service</li>
                <li className="hover:text-gray-300 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-gray-300 cursor-pointer">Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            © 2025 BetCompare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;