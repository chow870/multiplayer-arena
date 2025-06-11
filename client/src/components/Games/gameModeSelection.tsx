import { setGameMode } from '../../context/slices/gameSelectionSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import SinglePlayer from './GameModes/SinglePlayer';
import FriendMode from './GameModes/FriendMode';

function GameModeSelection() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const dispatch = useDispatch();

  const onSelect = (mode: string) => {
    setSelectedMode(mode);
    dispatch(setGameMode(mode));
  };

  // Render next component based on selected mode
  if (selectedMode === 'SINGLE') return <SinglePlayer />;
  if (selectedMode === 'FRIEND') return <FriendMode />;
  if (selectedMode === 'RANDOM') return <div className="mt-4">Random matchmaking will be implemented later.</div>;

  // Default mode selection UI
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose a Game Mode</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Single Player', mode: 'SINGLE' },
          { label: 'Play with Friend', mode: 'FRIEND' },
          { label: 'Random Opponent', mode: 'RANDOM' }
        ].map(({ label, mode }) => (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            className="bg-white border border-gray-300 rounded-lg shadow-sm px-6 py-4 text-center hover:bg-blue-50 transition-all duration-200 text-gray-800 font-medium"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameModeSelection;
