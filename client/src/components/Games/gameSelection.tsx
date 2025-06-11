import { setSelectedGame } from '../../context/slices/gameSelectionSlice';
import React from 'react';
import { useDispatch } from 'react-redux';
import GameModeSelection from './gameModeSelection';

function GameSelection() {
  const dispatch = useDispatch();
  const [gameSelectionFlag, setGameSelectionFlag] = React.useState(true);
  const [gameModeSelectionFlag, setGameModeSelectionFlag] = React.useState(false);

  const games = [
    { id: 1, name: 'Chess' },
    { id: 2, name: 'Checkers' },
    { id: 3, name: 'Tic Tac Toe' },
    { id: 4, name: 'Sudoku' },
    { id: 5, name: 'snakes_ladders' }
  ];

  const handleGameSelect = (gameName: string) => {
    dispatch(setSelectedGame(gameName.replace(/\s+/g, '_').toLowerCase()));
    setGameSelectionFlag(false);
    setGameModeSelectionFlag(true);
  };

  return (
    <div className="w-full">
      {gameSelectionFlag && (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose a Game to Start</h2>
          <div className="grid grid-cols-2 gap-4">
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => handleGameSelect(game.name)}
                className="cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200 p-4 rounded-lg shadow-sm text-center text-lg font-medium text-blue-900"
              >
                {game.name}
              </div>
            ))}
          </div>
        </>
      )}

      {gameModeSelectionFlag && !gameSelectionFlag && (
        <div className="mt-6">
          <GameModeSelection />
        </div>
      )}
    </div>
  );
}

export default GameSelection;
