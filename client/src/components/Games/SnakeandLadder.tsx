// SnakeLadder.tsx
import React, { useEffect, useState } from 'react';
import { ladders, snakes } from '../../constant/snakeAndLadder/snakeandladder';
import axios from 'axios';
import { updateGameMove } from './GameRoom/updateFunctions';
import { socket } from '../../socket/socket';

interface Props {
  gameId: string,
  gameState: Record<string, number>;
  currentTurn: number;
  emitMove: (moveData: any) => void;
  allPlayers: string[];
}

const SnakeLadder: React.FC<Props> = ({
  gameId,
  gameState,
  currentTurn,
  emitMove,
  allPlayers,
}) => {
  const myId = localStorage.getItem('userId')!;
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [moveMessage, setMoveMessage] = useState<string>('');

  // When gameState updates for this player, show a jump message
  useEffect(() => {
    if (lastRoll == null) return;
    const newPos = gameState[myId];
    setMoveMessage(`You moved to ${newPos}`);
  }, [gameState, lastRoll]);

  const rollDice = async (): Promise<any> => {
    // rather than on the forntend, it should be handled on the backend
    if (allPlayers[currentTurn] !== myId) return;
    try {
    const token = localStorage.getItem('token');

    const response = await axios.patch(
      `https://multiplayer-arena-1.onrender.com/api/v1/games/Gamelobby/${gameId}/updateGameState`,
      {
        currentState : gameState,
        currentPalyerId: myId,
        index: currentTurn, 
        totalPlayer: allPlayers.length
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Game state updated: [frontend roll dice]', response.data);
    setLastRoll(response.data.roll);
    setMoveMessage(`You rolled a ${response.data.roll}`);

    // here is the socket connection 
    emitMove({ roll: response.data.roll,newPosition: response.data.newPosition, updatedState: response.data.updatedState, nextTurn: response.data.nextTurn });

    // return response.data;
  } catch (err) {
    console.error('Error updating game state:', err);
    alert("forced exit is here");
    socket.emit("exitGameonGameOverForced",{});
    // throw err; // means there was some error in the backend , we will have to handle it 
    // implies that 500 means on thing, either the db issue or the server, in this case i will have to exit the game
    // but if the server is down i wont be able to send any socket response actually.
    // nor any http request will do anything in that case.
    // 
  }

    // updateGameMove({ gameId, currentState: gameState, index: currentTurn, totalPlayer: allPlayers.length,currentPalyerId: myId })
    
    // const roll = Math.floor(Math.random() * 6) + 1;
    // setLastRoll(roll);
    // setMoveMessage(`You rolled a ${roll}`);
    // emitMove({ roll });
  };

  // Helper to get color per player index
  const getColor = (idx: number) => ['red','blue','green','yellow','purple','orange'][idx % 6];

  // Render the 10x10 board with snakes/ladders
  const renderBoard = () => {
    const rows = [];
    for (let row = 9; row >= 0; row--) {
      const cells = [];
      for (let col = 0; col < 10; col++) {
        const isEven = row % 2 === 0;
        const num = isEven
          ? row * 10 + col + 1
          : row * 10 + (9 - col) + 1;

        // Markers
        const snakeEnd = snakes.get(num);
        const ladderEnd = ladders.get(num);

        // Players on this cell
        const playersHere = allPlayers?.filter(pid => gameState?.[pid] === num);
        cells.push(
          <div
            key={num}
            className={`relative w-14 h-14 border ${ (row + col) % 2 ? 'bg-green-50' : 'bg-white' } flex flex-col items-center justify-center`}
          >
            <div className="absolute top-0 left-0 text-[10px] text-gray-500 p-1">
              {num}
            </div>

            {/* Snake/Ladder Emojis */}
            {snakeEnd != null && (
              <div className="absolute bottom-0 left-0 text-[14px]">🐍</div>
            )}
            {ladderEnd != null && (
              <div className="absolute bottom-0 right-0 text-[14px]">🪜</div>
            )}

            {/* Player Tokens */}
            <div className="flex space-x-0.5 flex-wrap mt-4 transition-all duration-300">
              {playersHere.map((pid, i) => (
                <div
                  key={pid}
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white`}
                  style={{
                    backgroundColor: getColor(allPlayers.indexOf(pid)),
                  }}
                >
                  P{allPlayers.indexOf(pid) + 1}
                </div>
              ))}
            </div>
          </div>
        );
      }
      rows.push(<div key={row} className="flex">{cells}</div>);
    }
    return rows;
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex space-x-4">
        {allPlayers.map((pid, idx) => (
          <div key={pid} className="flex items-center space-x-1">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: getColor(idx) }}
            />
            <span className="text-sm">P{idx + 1}</span>
          </div>
        ))}
      </div>

      {/* Dice & Message */}
      <div className="flex items-center space-x-4">
        <button
          onClick={rollDice}
          disabled={allPlayers[currentTurn] !== myId}
          className={`px-4 py-2 rounded ${
            allPlayers[currentTurn] === myId
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          {allPlayers[currentTurn] === myId
            ? 'Roll Dice'
            : `Waiting for P${currentTurn + 1}`}
        </button>
        {lastRoll != null && (
          <span className="text-lg font-medium">🎲 {lastRoll}</span>
        )}
        {moveMessage && <span className="italic">{moveMessage}</span>}
      </div>

      {/* The Board */}
      <div className="inline-block border-2 border-gray-600">
        {renderBoard()}
      </div>
    </div>
  );
};

export default SnakeLadder;
