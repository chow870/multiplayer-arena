import { setBetAmountContext, setGameMode } from '../../context/slices/gameSelectionSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import SinglePlayer from './GameModes/SinglePlayer';
import FriendMode from './GameModes/FriendMode';

function GameModeSelection() {
  const [gameSelectionMode, setGameSelectionMode] = useState<boolean>(false);
  const [betAmount,setBetAmount] = useState<number>(0);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const dispatch = useDispatch();

  const onSelect = (mode: string) => {
    setSelectedMode(mode);
    dispatch(setGameMode(mode));
  };
  const onBetSet=(amount : number)=>{
      setBetAmount(amount);
      dispatch(setBetAmountContext(amount));
      setGameSelectionMode(true);
  }

  // Render next component based on selected mode
  if (selectedMode === 'SINGLE') return <SinglePlayer />;
  if (selectedMode === 'FRIEND') return <FriendMode />;
  if (selectedMode === 'RANDOM') return <div className="mt-4">Random matchmaking will be implemented later.</div>;

  // Default mode selection UI
  return (
    <>
      {!gameSelectionMode ? (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose the betting amount</h2>
          <h3 className='text-red-600'> Set it to 0 for free Challenges</h3>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Amount (₹)
          </label>
          <input
            id="betAmount"
            type="number"
            value={betAmount}
            min={0}
            step={1}
            className={`w-full p-2 border rounded focus:outline-none focus:ring ${
              'border-gray-300'
            }`}
            onChange={(e) => setBetAmount(Number(e.target.value))}
          />

          <button
            onClick={() => onBetSet(betAmount)}
            // disabled={isLoading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
          >Next</button>
        </>
      ) : (
        <>
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
        </>
      )}
    </>
  );
}

export default GameModeSelection;
