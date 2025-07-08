import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../../../socket/socket';
import { deductAmount, expireWaitingRoom } from './waitingLobbyHelperFunctions';

function WaitingRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const lobbyId = location?.state?.roomId;
  const [lobbyDetails, setLobbyDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joinedUserIds, setJoinedUserIds] = useState<string[]>([]);
  const [betAmount, setBetAmount] = useState(null);
  const myId = localStorage.getItem('userId');

  // 🎯 Fetch initial lobby info
  useEffect(() => {
    if (!lobbyId) return;

    socket.emit('joinWaitingLobby', { lobbyId, userId: myId });

    const fetchLobby = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://multiplayer-arena-1.onrender.com/api/v1/games/lobby/${lobbyId}/details`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setLobbyDetails(res.data.lobby);
        setBetAmount(res.data.lobby.betAmount);
      } catch (error) {
        console.error("Error fetching lobby:", error);
        alert('Error fetching lobby. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLobby();

    socket.on('lobbyUpdated', (updated: string[]) => {
      setJoinedUserIds(updated);
    });

    socket.on('startGame', (data: any) => {
      console.log("✅ Game started. Navigating...");
      navigate('/game/play', { state: data });
    });

    socket.on('forced_exit', () => {
      alert('⛔Insufficient balance detected. Please ensure all players meet the stake requirement.');
      navigate('/game');
    });

    return () => {
      socket.emit('leaveWaitingLobby', { lobbyId, userId: myId });
      socket.off('lobbyUpdated');
      socket.off('startGame');
      socket.off('forced_exit');
    };
  }, [lobbyId]);

  // 🧠 React to all players joining : 
  useEffect(() => {
    if (!lobbyDetails || joinedUserIds.length === 0) return;

    const expectedCount = lobbyDetails.invitedUserIds.length + 1;
    const allJoined = joinedUserIds.length === expectedCount;
    joinedUserIds.sort();
    if (allJoined) {
      const isLastUser = myId === joinedUserIds[joinedUserIds.length - 1];

      if (isLastUser) {
        handleFinalStart();
      }
    }
  }, [joinedUserIds]);

  // 🚀 Core handler for deduction + startGame emit
  const handleFinalStart = async () => {
    console.log("🎯 Final user initiating game setup...");

    let attempt = 0;
    let success = false;
    const maxRetries = 3;

    while (attempt < maxRetries && !success) {
      try {
        setLoading(true);
        const res = await deductAmount(lobbyId);

        if (res?.betId || res?.alreadyPlaced) {
          success = true;

          await expireWaitingRoom(lobbyId);
          const data = await fetchGameData(lobbyDetails.gameLobbyId);

          socket.emit('gameLobbyReady', { data, lobbyId });
          break;
        } else {
          throw new Error('Bet deduction failed');
        }
      } catch (err) {
        console.warn(`❌ Deduction attempt ${attempt + 1} failed`, err);
        attempt++;
      } finally {
        setLoading(false);
      }
    }

    if (!success) {
      alert('❌ Failed to start game after multiple attempts. Please try again.');
      socket.emit('deduction_failed', lobbyId);
      navigate('/game');
    }
  };

  // 🛠️ Game data builder
  const fetchGameData = async (gameLobbyId: string) => {
    const res = await axios.get(`https://multiplayer-arena-1.onrender.com/api/v1/games/Gamelobby/${gameLobbyId}/details`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    const allPlayers = [
      ...res.data.gameLobby.invitedUserIds,
      res.data.gameLobby.playerId
    ].sort();

    return {
      gameId: res.data.gameLobby.id || " ",
      gameType: res.data.gameLobby.gameType,
      createdAt: res.data.gameLobby.createdAt,
      allPlayers,
      gameState: res.data.gameLobby.currentState || {},
      currentTurn: res.data.gameLobby.currentTurn || 0,
      endedAt: res.data.gameLobby?.endedAt,
      betAmount: res.data.gameLobby?.betAmount
    };
  };

  // ⛔ Leave button
  const handleLeave = () => {
    navigate('/game');
  };

  if (loading) return <div>Loading...</div>;
  if (!lobbyDetails) return <div>No lobby details found.</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">⏳ Waiting Room</h2>
      <p><strong>Room ID:</strong> {lobbyId}</p>
      <p><strong>Created By:</strong> {lobbyDetails.createdBy.username}</p>
      {betAmount && <p><strong>Stake:</strong> {betAmount}</p>}
      <p><strong>Players Joined:</strong> {joinedUserIds.length} / {lobbyDetails.invitedUserIds.length + 1}</p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Players in Lobby:</h3>
        <ul className="list-disc pl-5">
          {joinedUserIds.map((userId) => (
            <li key={userId}>{userId}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 space-x-2">
        <button onClick={handleLeave} className="px-4 py-2 bg-red-500 text-white rounded">
          Leave
        </button>
      </div>
    </div>
  );
}

export default WaitingRoom;
