import { socket } from '../../../socket/socket';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function FriendMode() {
  const onlineFriends = useSelector((state: any) => state.onlineUsers.users); // array of user objects
  const [acceptedFriends, setAcceptedFriends] = useState<string[]>([]);
  const [alreadyInvited, setAlreadyInvited] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const myId = localStorage.getItem('userId'); // Assuming you have user ID in your Redux store
  const gameType = useSelector((state: any)=> state.selectedGameRecord.selectedGameId);

  // Fetch accepted friendships
  // also i will have to socket connection.

  useEffect(() => {
    async function fetchFriendships() {
      try {
        const response = await axios.get('/api/v1/friendships', {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        let friends : string[] = [];
        for(let i = 0; i < response.data.acceptedFriends.length; i++) {
          friends.push(response.data.acceptedFriends[i].receiverid);
          friends.push(response.data.acceptedFriends[i].senderid);
        }
        console.log('Accepted Friends:', friends);
        console.log('Online Friends:', onlineFriends);

        setAcceptedFriends(friends); // array of friend user IDs
        // setAcceptedFriends(response.data.acceptedFriends || []); // optional: your backend should return this
        // setAlreadyInvited(response.data.alreadyInvited || []); // optional: your backend should return this
        setIsLoading(false);
      } catch (error) {
        alert("Error in fetching friendships");
        console.error('Error fetching friendships:', error);
        setIsLoading(false);
      }
    }

    fetchFriendships();
    return () => {
      // Cleanup if needed
    }
  }, []);

  // Handle sending an invite
  const handleInvite = async (invitedUserId: string) => {
    try {
      // here i also have to create the gameLobby
      // then have to set the gameLobbyId ref as ->
        const response2 = await axios.post(
        '/api/v1/games/createGame',
        { invitedUserIds : [invitedUserId],
          gameType
         },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const gameLobbyId = response2.data.id; 
      const response = await axios.post(
        '/api/v1/games/invite',
        { invitedUserId,
          createdById: myId,
          gameMode: "FRIEND",
          gameLobbyId
         },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert('Invitation sent successfully');
      
      setAlreadyInvited((prev) => [...prev, invitedUserId]);
      // the waiting lobby id will be sent to me here.
      const id = response.data.lobbyId; // Assuming your backend returns the lobby ID
        console.log('Lobby ID:', id);
        socket.emit('lobbyCreated', { lobbyId: id,invitedUserId});

    } catch (error) {
      alert("Error in sending game invite");
      console.error('Error sending game invite:', error);
    }
  };

  // Final list: Only online + accepted friends + not already invited
  const filteredFriends = onlineFriends?.filter(
    (friend: any) => {
      // console.log('Friend:', friend);
      console.log('Online Friends:', onlineFriends);
      console.log('Accepted Friends:', acceptedFriends);
      console.log('Already Invited:', alreadyInvited);
      return acceptedFriends.includes(friend) && !alreadyInvited?.includes(friend)&& friend !== myId;
    }
  );

  if (isLoading) {
    return <div>Loading friends...</div>;
  }
  console.log('Filtered Friends:', filteredFriends);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Invite Online Friends</h2>
      {filteredFriends?.length === 0 ? (
        <div className="text-gray-500">No online friends available to invite.</div>
      ) : (
        <ul className="space-y-2">
          {filteredFriends?.map((friend: any) => (
            <li
              key={friend}
              className="flex justify-between items-center border p-2 rounded shadow-sm bg-white"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={friend.avatarUrl || '/default-avatar.png'}
                  alt={friend.username}
                  className="w-8 h-8 rounded-full"
                />
                <span>{friend.username}</span>
              </div>
              <button
                onClick={() => handleInvite(friend)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Invite
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FriendMode;
