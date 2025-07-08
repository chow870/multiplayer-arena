// components/ReceivedInvites.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../../socket/socket';

type Lobby = {
  id: string;
  betAmount ?: number
};

function ReceivedInvites() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('LobbyInviteReceived', (lobby: any) => {
      // This will handle the case when a new invite is received
      setLobbies(prev => [...prev, {id:lobby.lobbyId}]);
    });

    async function fetchInvites() {
      try {
        const res = await axios.get('https://multiplayer-arena-1.onrender.com/api/v1/games/invites', {
          headers: {
            'authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setLobbies(res.data.lobbies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invites:', error);
        alert('Failed to load invites');
        setLoading(false);
      }
    }

    fetchInvites();
    return () => {
      socket.off('LobbyInviteReceived');
    };
  }, []);

  const handleReject = async (lobbyId: string) => {
    try {
      await axios.delete(`https://multiplayer-arena-1.onrender.com/api/v1/games/lobby/${lobbyId}`, {
        headers: {
          'authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setLobbies(prev => prev.filter(lobby => lobby.id !== lobbyId));
    } catch (error) {
      console.error('Error rejecting invite:', error);
      alert('Failed to reject invite');
    }
  };

  const handleJoin = (lobbyId: string) => {
    navigate('/game/waitingLobby', { state: { roomId: lobbyId } });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">📩 Received Game Invites</h2>
      {lobbies.length === 0 ? (
        <p>No invites received.</p>
      ) : (
        lobbies.map(lobby => (
          <div key={lobby.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
            <div>
              <p className="font-medium">Lobby ID: {lobby.id}</p>
              <p className="font-small">Stake : {lobby?.betAmount}||0 </p>
                <p className="text-sm text-gray-500">You have been invited to join this lobby.</p>
            </div>
            <div className="space-x-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleJoin(lobby.id)}
              >
                Join
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleReject(lobby.id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReceivedInvites;
