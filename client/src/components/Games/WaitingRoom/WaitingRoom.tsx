import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../../../socket/socket';
import { set } from 'zod';
import { expireWaitingRoom } from './waitingLobbyHelperFunctions';

function WaitingRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const lobbyId = location?.state?.roomId;
  const [lobbyDetails, setLobbyDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const myId = localStorage.getItem('userId');
  const [dataToTransfer, setDataToTransfer] = useState<any>(null);
  const [joinedUserIds, setJoinedUserIds] = useState<string[]>([]);
  const [boolToTransfer, setBoolToTransfer] = useState(false);
  // here i have to add the socket logic to update the no of players joined in the lobby

  useEffect(() => {
    socket.on('startGame', (data: any) => {
      console.log(`[frontend] Game started with data:`, data);
      navigate('/game/play', { state: data });
    });
    console.log(`[frontend] WaitingRoom component mounted with lobbyId: ${lobbyId}`);
    if (!lobbyId) return;
    socket.emit('joinWaitingLobby', {lobbyId: lobbyId, userId: myId});
    socket.on('lobbyUpdated', (updatedLobby:string[]) => {
      setJoinedUserIds(updatedLobby);
    });

    async function fetchLobby() {
      try {
        console.log(`[frontend] Fetching lobby details for ID: ${lobbyId}`);
        setLoading(true);
        const res = await axios.get(`/api/v1/games/lobby/${lobbyId}/details`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setLobbyDetails(res.data.lobby);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lobby:', error);
        alert('Error fetching lobby details');
        setLoading(false);
      }
    }

    fetchLobby();
    return () => {
      socket.off("lobbyUpdated");
      socket.emit('leaveWaitingLobby', {lobbyId: lobbyId, userId: myId});
      console.log(`Left waiting lobby: ${lobbyId}`);
    };
  }, [lobbyId]);



  useEffect(() => {
    if (lobbyDetails) {
      const totalExpected = lobbyDetails.invitedUserIds.length + 1;
      const totalJoined = joinedUserIds.length || 0;
      
      if (totalExpected === totalJoined) {
        // then i will fetch the deatils of the game lobby
        setBoolToTransfer(true);
        console.log(`[frontend] All players joined. Total expected: ${totalExpected}, Total joined: ${totalJoined}`);
        async function fetchGameLobby() {
          setLoading(true);
          try {
            const res = await axios.get(`/api/v1/games/Gamelobby/${lobbyDetails.gameLobbyId}/details`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            console.log(`[frontend] Fetched game lobby details:`, res.data.gameLobby);
            const allPlayers : string[]  = res.data.gameLobby.invitedUserIds;
            allPlayers.push(res.data.gameLobby.playerId);
            allPlayers.sort(); 
            console.log(`[frontend] All players in game lobby:`, allPlayers);
            const data = {
              gameId: res.data.gameLobby.id || " ",
              gameType: res.data.gameLobby.gameType,
              createdAt: res.data.gameLobby.createdAt,
              allPlayers,
              gameState: res.data.gameLobby.currentState || {},
              currentTurn: res.data.gameLobby.currentTurn || 0,
              endedAt: res.data.gameLobby?.endedAt
            };
            setDataToTransfer(data);
            console.log(`[frontend] Data to transfer:`, data);
            // handleStartGame();
            // here i have to make it expire at now so that no one else can join now
            expireWaitingRoom(lobbyId);
            socket.emit('gameLobbyReady', { data,lobbyId });
            setLoading(false);

          } catch (error) {
            console.error('Error fetching Gamelobby:', error);
            alert('Error fetching lobby details');
            setLoading(false);
          }
        }
        
      fetchGameLobby();
      }
    }
  }, [lobbyDetails]);


   const handleLeave = async () => {
    // Optional: call backend to remove from joinedUserIds if needed
    navigate('/game');
  };
 
  if(loading) return <div>Loading...</div>;
  if (!lobbyDetails) return <div>No lobby details found.</div>;


  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">⏳ Waiting Room</h2>
      <p><strong>Room ID:</strong> {lobbyId}</p>
      <p><strong>Created By:</strong> {lobbyDetails.createdBy.username}</p>
      <p><strong>Players Joined:</strong> {joinedUserIds.length} / {lobbyDetails?.invitedUserIds.length + 1}</p>
        <div className="mt-4">
            <h3 className="text-lg font-semibold">Players in Lobby:</h3>
            <ul className="list-disc pl-5">
            {joinedUserIds?.map((userId) => (
                <li key={userId}>{userId}</li>
            ))}
            </ul>
        </div>

      <div className="mt-4 space-x-2">
        <button onClick={handleLeave} className="px-4 py-2 bg-red-500 text-white rounded">Leave</button>
      </div>
    </div>
  );
}


export default WaitingRoom;


