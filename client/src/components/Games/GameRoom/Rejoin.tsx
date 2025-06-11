// Rejoin.tsx
import { clearGameRoom } from '../../../context/slices/gameLobbyJoined';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface GameRoomState {
  gameId: string;
  gameType: string;
  createdAt: string;
  allPlayers: string[];
  gameState?: Record<string, number>;
  currentTurn?: number;
  endedAt?: Date
}

function Rejoin() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const gameLobbyId = useSelector((state: any) => state.lastSelectedGame.activeGameId);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!gameLobbyId) return;

    const fetchGameLobby = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/v1/games/Gamelobby/${gameLobbyId}/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const allPlayers: string[] = [...res.data.gameLobby.invitedUserIds, res.data.gameLobby.playerId];
        allPlayers.sort(); // Ensure players are sorted for consistency
        console.log('[Rejoin]Fetched Game Lobby:', res.data);
        const gameData: GameRoomState = {
          gameId: res.data.gameLobby.id || " ",
          gameType: res.data.gameLobby.gameType,
          createdAt: res.data.gameLobby.createdAt,
          allPlayers,
          gameState: res.data.gameLobby.currentState  || {},
          currentTurn: res.data.gameLobby.currentTurn || 0,
          endedAt : res.data.gameLobby?.endedAt
        };
        console.log('[Rejoin]Game Data:',  gameData);

        setData(gameData);
      } catch (error) {
        console.error('Error fetching Gamelobby:', error);
        alert('Error fetching lobby details');
      } finally {
        setLoading(false);
      }
    };

    fetchGameLobby();
  }, [gameLobbyId]);

  if (loading) return <div>Loading game data...</div>;

  return (
    <>
      <div>Rejoin the lobby</div>
      <button
        disabled={!data}
        onClick={() => {
          console.log('[Rejoin]Navigating to play with data:', data);
          if (data) navigate('/game/play', { state: { data } });
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Join now !!!
      </button>
      <button
      onClick={() => {
          dispatch(clearGameRoom());
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >Decline</button>
    </>
  );
}

export default Rejoin;
