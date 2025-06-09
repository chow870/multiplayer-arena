// GameRoom.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SnakeLadder from '../SnakeandLadder';
import { socket } from '../../../socket/socket';
import { useDispatch } from 'react-redux';
import { clearGameRoom, setGameRoom } from '../../../context/slices/gameLobbyJoined';
import { declareWinner, updateGameMove } from './updateFunctions';

interface GameRoomState {
  gameId: string;
  gameType: string;
  createdAt: string;
  allPlayers: string[];
  gameState?: Record<string, number>;
  currentTurn?: number;
}

interface GameStateUpdatePayload {
  state: Record<string, number>;
  nextTurn: number;
}

interface GameWinnerPayload {
  winnerId: string;
}

function GameRoom() {
  // 1) Pull all initial data once:
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!location.state?.data) navigate('/game');
  }, [location.state, navigate]);

  const data = location.state?.data;
  if (!data) return null;

  const {
    gameId,
    gameType,
    allPlayers,
    gameState: initialState,
    currentTurn: initialTurn,
  } = data;

  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const myId = localStorage.getItem('userId')!;

  // 2) Initialize React state from location.data if present:
  interface PlayerPositions {
    [playerId: string]: number;
  }

  const [gameState, setGameState] = useState<PlayerPositions>(
    () =>
      initialState
        ? { ...initialState }
        : allPlayers.reduce((acc: PlayerPositions, pid: string) => {
            acc[pid] = 1;
            return acc;
          }, {} as PlayerPositions)
  );
  const [currentTurn, setCurrentTurn] = useState<number>(initialTurn ?? 0);

  // 3) Refs to always hold latest values for timers/closures:
  const gameStateRef = useRef(gameState);
  const currentTurnRef = useRef(currentTurn);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  useEffect(() => {
    currentTurnRef.current = currentTurn;
  }, [currentTurn]);

  // 4) Other UI state:
  const [playersReady, setPlayersReady] = useState(false);
  const [playersJoined, setPlayersJoined] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  // 5) Timer refs:
  const moveTimer = useRef<NodeJS.Timeout>();
  const countdownTimer = useRef<NodeJS.Timeout>();

  // — JOIN / LEAVE ROOM & LOBBY SYNC
  useEffect(() => {
    dispatch(clearGameRoom());
    socket.emit('join_game_room', { gameId, userId: myId });

    socket.on('updateGameLobby', (joined: string[]) => {
      setPlayersJoined(joined);
      setPlayersReady(joined.length === allPlayers.length);
    });

    socket.on('exitGameonGameOver', () => {
      dispatch(clearGameRoom());
      navigate('/game');
    });

    return () => {
      socket.emit('leave_game_room', { gameId, userId: myId });
      socket.off('updateGameLobby');
      socket.off('exitGameonGameOver');
    };
  }, [gameId, allPlayers.length, myId, navigate, dispatch]);

  // — GAME STATE SYNC & TIMER START
  useEffect(() => {
    if (!playersReady) return;

    socket.on('game_state_update', ({ state, nextTurn }: GameStateUpdatePayload) => {
      setGameState(state);
      setCurrentTurn(nextTurn);
      startMoveTimer();
    });

    socket.on('gamewinnerannounce', ({ winnerId }: GameWinnerPayload) => {
      setGameOver(true);
      setWinnerId(winnerId);
      clearMoveTimer();
    });

    return () => {
      socket.off('game_state_update');
      socket.off('gamewinnerannounce');
      clearMoveTimer();
    };
  }, [playersReady]);

  // — START / CLEAR TIMERS
  const startMoveTimer = () => {
    clearMoveTimer();
    setCountdown(5);

    countdownTimer.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) clearInterval(countdownTimer.current!);
        return c - 1;
      });
    }, 1000);

    moveTimer.current = setTimeout(() => passTurn(), 5000);
  };
  const clearMoveTimer = () => {
    clearTimeout(moveTimer.current);
    clearInterval(countdownTimer.current);
  };

  // — PASS TURN (uses refs for fresh state)
  const passTurn = () => {
    if (gameOver) return;
    const next = (currentTurnRef.current + 1) % allPlayers.length;
    socket.emit('make_move', {
      gameId,
      moveData: null,
      state: gameStateRef.current,
      nextTurn: next,
    });
  };

  // — EMIT A REAL MOVE
  const emitMove = (moveData: any) => {
    if (gameOver || allPlayers[currentTurn] !== myId) return;
    clearMoveTimer();
    const next = (currentTurn + 1) % allPlayers.length;
    const updatedState = {
      ...gameStateRef.current,
      [myId]: (gameStateRef.current[myId] || 1) + moveData.roll,
    };

    updateGameMove({ gameId, currentState: updatedState, nextTurn: next });
    socket.emit('make_move', {
      gameId,
      moveData,
      state: updatedState,
      nextTurn: next,
    });
  };

  // — WINNER DETECTION
  useEffect(() => {
    for (const [pid, pos] of Object.entries(gameState)) {
      if (pos >= 100 && !gameOver) {
        setGameOver(true);
        setWinnerId(pid);
        socket.emit('game_winner_announce', { winnerId: pid });
        declareWinner({ gameId, winnerId: pid });
        clearMoveTimer();
        break;
      }
    }
  }, [gameState]);

  // — RENDER
  if (!playersReady) {
    return (
      <div>
        Waiting for players… {playersJoined.length}/{allPlayers.length}
        <button
          onClick={() => {
            dispatch(setGameRoom(gameId));
            socket.emit('leave_game_room', { gameId, userId: myId });
            navigate('/game');
          }}
        >
          Leave the room
        </button>
      </div>
    );
  }

  const commonProps = { gameState, currentTurn, emitMove, allPlayers };

  return (
    <div className="space-y-4 p-4">
      <button
        className="px-4 py-2 bg-red-500 text-white rounded"
        onClick={() => {
          socket.emit('leave_game_room', { gameId, userId: myId });
          dispatch(setGameRoom(gameId));
          navigate('/game');
        }}
      >
        Leave the room
      </button>

      {winnerId && (
        <div className="text-center bg-green-100 text-green-800 font-bold p-2 rounded">
          🎉 Player {allPlayers.indexOf(winnerId) + 1} Won the Game!
        </div>
      )}

      {!gameOver && allPlayers[currentTurn] === myId && (
        <div className="text-center font-semibold text-blue-700">
          ⏳ Your turn — auto pass in {countdown}s
        </div>
      )}

      {gameType === 'snakes_ladders' && <SnakeLadder {...commonProps} />}
    </div>
  );
}

export default GameRoom;
