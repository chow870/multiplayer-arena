// Game.tsx
import { ladders, snakes } from '../../constant/snakeAndLadder/snakeandladder';
import React, { useState } from 'react';
// import Board from './Board';
// import { snakes, ladders } from './constants';
import Board  from '../../constant/snakeAndLadder/board';


const Game: React.FC = () => {
  const [position, setPosition] = useState(1);
  const [message, setMessage] = useState('');

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    let newPosition = position + roll;
    if (newPosition > 100) newPosition = position; // can't overshoot

    if (snakes.has(newPosition)) {
      setMessage(`🐍 Oops! Snake bites. Down to ${snakes.get(newPosition)}`);
      newPosition = snakes.get(newPosition)!;
    } else if (ladders.has(newPosition)) {
      setMessage(`📈 Nice! Climbed a ladder to ${ladders.get(newPosition)}`);
      newPosition = ladders.get(newPosition)!;
    } else {
      setMessage(`Moved to ${newPosition}`);
    }
    setPosition(newPosition);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">🎲 Snakes and Ladders</h1>
      <Board playerPosition={position} />
      <button onClick={rollDice} className="bg-blue-500 text-white px-4 py-2 rounded">
        Roll Dice
      </button>
      <div className="text-lg">{message}</div>
    </div>
  );
};

export default Game;