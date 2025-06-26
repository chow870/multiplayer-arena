import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SnakeLadder from '../SnakeandLadder';
import { socket } from '../../../socket/socket';
import { useDispatch } from 'react-redux';
import { clearGameRoom, setGameRoom } from '../../../context/slices/gameLobbyJoined';
import { declareWinner } from './updateFunctions';
import Confetti from 'react-confetti';

interface GameRoomState {
  gameId: string;
  gameType: string;
  createdAt: string;
  allPlayers: string[];
  gameState?: Record<string, number>;
  currentTurn?: number;
  endedAt?: string;
  betAmount: number;
}

interface GameStateUpdatePayload {
  state: Record<string, number>;
  nextTurn: number;
}

interface GameWinnerPayload {
  winnerId: string;
}

export default function GameRoom() {
  const { gameId, gameType, allPlayers, gameState: initialState, currentTurn: initialTurn, endedAt, betAmount } =
    useLocation().state.data as GameRoomState;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myId = localStorage.getItem('userId')!;
  const expireAt = endedAt;

  const [gameState, setGameState] = useState<Record<string, number>>(
    initialState && Object.keys(initialState).length !== 0
      ? initialState
      : allPlayers.reduce((acc, player) => ({ ...acc, [player]: 0 }), {})
  );

  const [currentTurn, setCurrentTurn] = useState<number>(initialTurn ?? 0);
  const [playersJoined, setPlayersJoined] = useState<string[]>([]);
  const [playersReady, setPlayersReady] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [winnerInfo, setWinnerInfo] = useState<{ username: string; avatarUrl?: string } | null>(null);
  const [showWinner, setShowWinner] = useState(false);

  const [remainingExpire, setRemainingExpire] = useState<number>(0);
  const expireInterval = useRef<NodeJS.Timeout>();
  const moveTimer = useRef<NodeJS.Timeout>();
  const moveInterval = useRef<NodeJS.Timeout>();
  const [moveCountdown, setMoveCountdown] = useState(5);

  const gameStateRef = useRef(gameState);
  const currentTurnRef = useRef(currentTurn);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { currentTurnRef.current = currentTurn; }, [currentTurn]);

  useEffect(() => {
    if (expireAt && Date.now() >= new Date(expireAt).getTime()) declareAndExit();
    dispatch(clearGameRoom());
    socket.emit('join_game_room', { gameId, userId: myId });

    socket.on('updateGameLobby', (joined: string[]) => {
      setPlayersJoined(joined);
      setPlayersReady(joined.length === allPlayers.length);

      if (joined.length < allPlayers.length && expireAt) {
        startExpireCountdown();
      }
    });

    socket.on('exitGameonGameOver', () => {
      dispatch(clearGameRoom());
      navigate('/game');
    });

    return () => {
      socket.emit('leave_game_room', { gameId, userId: myId });
      socket.off('updateGameLobby');
      clearExpireCountdown();
    };
  }, [gameId, allPlayers.length]);

  useEffect(() => {
    if (expireAt) {
      const until = new Date(expireAt).getTime() - Date.now();
      if (until > 0 && playersJoined.length < allPlayers.length) {
        startExpireCountdown(until / 1000);
      }
    }
    return () => clearExpireCountdown();
  }, [expireAt, playersJoined]);

  function startExpireCountdown(secondsLeft: number = remainingExpire) {
    clearExpireCountdown();
    setRemainingExpire(Math.floor(secondsLeft));
    expireInterval.current = setInterval(() => {
      setRemainingExpire(prev => {
        if (prev <= 1) {
          clearExpireCountdown();
          declareAndExit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function clearExpireCountdown() {
    if (expireInterval.current) clearInterval(expireInterval.current);
  }

  function declareAndExit() {
    setGameOver(true);
    socket.emit('game_over', { gameId, winnerId: null });
    dispatch(clearGameRoom());
    navigate('/game');
  }

  useEffect(() => {
    if (!playersReady) return;

    socket.on('game_state_update', ({ state, nextTurn }: GameStateUpdatePayload) => {
      setGameState(state);
      setCurrentTurn(nextTurn);
      startMoveCountdown();
    });

    socket.on('game_winner_announce', ({ winnerId }: GameWinnerPayload) => {
      setGameOver(true);
      setWinnerId(winnerId);
      clearMoveCountdown();
    });

    return () => {
      clearMoveCountdown();
    };
  }, [playersReady]);

  function startMoveCountdown() {
    clearMoveCountdown();
    setMoveCountdown(5);
    moveInterval.current = setInterval(() => setMoveCountdown(c => (c > 1 ? c - 1 : 0)), 1000);
    moveTimer.current = setTimeout(passTurn, 60000);
  }

  function clearMoveCountdown() {
    if (moveTimer.current) clearTimeout(moveTimer.current);
    if (moveInterval.current) clearInterval(moveInterval.current);
  }

  function passTurn() {
    if (gameOver) return;
    const next = (currentTurnRef.current + 1) % allPlayers.length;
    socket.emit('make_move', {
      gameId,
      moveData: null,
      state: gameStateRef.current,
      nextTurn: next,
    });
  }

  async function emitMove(moveData: any) {
    if (gameOver || allPlayers[currentTurn] !== myId) return;
    clearMoveCountdown();

    socket.emit('make_move', {
      gameId,
      moveData: moveData.roll,
      state: moveData.updatedState,
      nextTurn: moveData.nextTurn,
    });
  }

  useEffect(() => {
    for (const [pid, pos] of Object.entries(gameState)) {
      if (pos >= 100 && !gameOver) {
        setGameOver(true);
        setWinnerId(pid);
        socket.emit('game_winner_announce', { winnerId: pid });

        (async () => {
          try {
            const winner = await declareWinner({ gameId, winnerId: pid });
            setWinnerInfo({ username: winner.username, avatarUrl: winner.avatarUrl });
            setShowWinner(true);
            setTimeout(() => {
              setShowWinner(false);
              socket.emit('game_over', { gameId, winnerId: null });
            }, 4000);
          } catch (err) {
            console.error("Failed to declare winner:", err);
            dispatch(clearGameRoom());
            navigate('/game');
          }
        })();

        clearMoveCountdown();
        break;
      }
    }
  }, [gameState]);

  // --- RENDER ---

  if (!playersReady) {
    return (
      <div className="max-w-md mx-auto text-center mt-20 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Waiting for players…</h2>
        <p>{playersJoined.length} / {allPlayers.length} joined.</p>
        {expireAt && remainingExpire > 0 && playersJoined.length < allPlayers.length && (
          <p className="mt-2 text-red-600">Lobby expires in {remainingExpire}s</p>
        )}
        <button
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => {
            socket.emit('leave_game_room', { gameId, userId: myId });
            dispatch(setGameRoom(gameId));
            navigate('/game');
          }}
        >
          Leave Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => {
          socket.emit('leave_game_room', { gameId, userId: myId });
          dispatch(setGameRoom(gameId));
          navigate('/game');
        }}
      >
        Leave Game
      </button>

      {showWinner && winnerInfo && (
        <>
          <Confetti />
          <div className="text-center text-white font-bold text-2xl p-4 bg-gradient-to-r from-green-400 via-yellow-300 to-pink-400 rounded-lg shadow-lg animate-bounce">
            🎉 {winnerInfo.username} won the Game! 🎉
          </div>
          {winnerInfo.avatarUrl && (
            <div className="flex justify-center mt-4">
              <img
                src={winnerInfo.avatarUrl}
                alt="Winner Avatar"
                className="w-20 h-20 rounded-full border-4 border-yellow-300"
              />
            </div>
          )}
        </>
      )}

      {!gameOver && allPlayers[currentTurn] === myId && (
        <div className="text-center text-blue-700 font-semibold">
          ⏳ Your turn — auto pass in {moveCountdown}s
        </div>
      )}

      {gameType === 'snakes_ladders' && (
        <SnakeLadder
          gameId={gameId}
          gameState={gameStateRef.current}
          currentTurn={currentTurnRef.current}
          emitMove={emitMove}
          allPlayers={allPlayers}
        />
      )}
    </div>
  );
}
