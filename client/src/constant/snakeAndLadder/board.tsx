// Board.tsx
import React from 'react';
import { ladders, snakes } from './snakeandladder';
// import { snakes, ladders } from './constants';

type BoardProps = {
  playerPosition: number;
};

const Board: React.FC<BoardProps> = ({ playerPosition }) => {
  const getCellType = (i: number) => {
    if (snakes.has(i)) return 'snake';
    if (ladders.has(i)) return 'ladder';
    return 'normal';
  };

  const renderCells = () => {
    const cells = [];
    for (let i = 100; i >= 1; i--) {
      const cellType = getCellType(i);
      const isPlayer = playerPosition === i;

      cells.push(
        <div
          key={i}
          className={`border w-10 h-10 flex items-center justify-center text-xs relative ${
            (Math.floor((i - 1) / 10) % 2 === 1) ? 'order-reverse' : ''
          }`}
          style={{ backgroundColor: isPlayer ? '#90cdf4' : '#f7fafc' }}
        >
          <div>
            {i}
            <div className="text-[10px] absolute top-1 right-1">
              {cellType === 'snake' && '🐍'}
              {cellType === 'ladder' && '📈'}
            </div>
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="grid grid-cols-10 w-max border-2 border-black">
      {renderCells()}
    </div>
  );
};
export default Board;