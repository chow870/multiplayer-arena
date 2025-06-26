import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../../socket/socket';

type Lobby = {
  id: string;
  betAmount ?:number
};

function SentMyMe() {
  const [sentLobbies, setSentLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('selfInviteSent', (data :any) => {
        // This will handle the case when a new lobby is created
        // and you want to update the sent invites list
        console.log("[fronted] in the sentMyMe.tsx selfInviteSent event", data);
        setSentLobbies(prev => [...prev, {id:data.lobbyId}]);
    });

    async function fetchSentInvites() {
      try {
        const res = await axios.get('/api/v1/games/sent-invites', {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSentLobbies(res.data.lobbies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sent invites:', error);
        alert('Failed to load sent invites.');
        setLoading(false);
      }
    }

    fetchSentInvites();
    return () => {
      socket.off('lobbyCreated');
    };
  }, []);

  const handleJoinLobby = async (lobbyId: string) => {
  try {
    const res = await axios.post(`/api/v1/games/lobby/${lobbyId}/join`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (res.data?.lobbyId) {
      navigate('/game/waitingLobby', { state: { roomId: res.data.lobbyId } });
    }
  } catch (error: any) {
    console.error('Error joining lobby:', error);
    alert(error?.response?.data?.error || 'Failed to join lobby');
  }
};

  const handleCancelInvite = async (lobbyId: string) => {
    try {
      await axios.delete(`/api/v1/games/lobby/${lobbyId}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSentLobbies(prev => prev.filter(lobby => lobby.id !== lobbyId));
    } catch (error) {
      console.error('Error cancelling invite:', error);
      alert('Failed to cancel invite.');
    }
  };

  if (loading) return <div>Loading sent invites...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">📤 Sent Game Invites</h2>
      {sentLobbies.length === 0 ? (
        <p>No sent invites found.</p>
      ) : (
        sentLobbies.map(lobby => (
          <div
            key={lobby.id}
            className="border p-4 rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-medium">Lobby ID: {lobby.id}</p>
              <p className="font-small">Stake : {lobby?.betAmount}||0 </p>
                <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleJoinLobby(lobby.id)}
                >
                    Join
                </button>
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleCancelInvite(lobby.id)}
            >
              Cancel Invite
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default SentMyMe;
