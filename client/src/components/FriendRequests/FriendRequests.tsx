// FriendRequests.tsx
import axios from 'axios';
import React, { useState, useEffect } from 'react';
interface Friends {
    id: string;
    senderid?: string;
    sendername?: string;
    receiverid?: string;
    receivername?: string;    
    status?: string;
}

function FriendRequests() {
  const [pendingRequests, setPendingRequests] = useState<Friends[]>([]);
  const [acceptedFriends, setAcceptedFriends] = useState<Friends[]>([]);
  const [blockedFriends, setBlockedFriends] = useState<Friends[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchFriendships() {
      try {
        console.log("going to hit the backend api to fetch the friendships");
        const response = await axios.get('/api/v1/friendships',{
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPendingRequests(response.data.pendingRequests);
        setAcceptedFriends(response.data.acceptedFriends);
        setBlockedFriends(response.data.blockedUsers);
        setIsLoading(false);
      } catch (error) {
        alert("error in fetching the friendships");
        setIsLoading(false);
        console.log(error)
        console.error('Error fetching friendships:', error);
      }
    }
    fetchFriendships();
  }, []);

  const handleAcceptRequest = async (friendId :string|any) => {
    try {
      console.log("going to hit the backend api to accept the friend request", friendId);
      await axios.post(`/api/v1/friend-request/accept`,
        {friendId: friendId},
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

      // Update the state to reflect the accepted request
      setPendingRequests((prev) => prev.filter((f) => f.id !== friendId));
      const acceptedFriend = pendingRequests.find((f) => f.id === friendId);
      setAcceptedFriends((prev) => [...prev, { id: friendId, sendername: acceptedFriend?.sendername || '', receivername: acceptedFriend?.receivername || '', status: 'ACCEPTED' }]); // look out for here.
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleBlockRequest = async (friendId: string|any) => {
    try {
      await axios.post(`/api/v1/friend-request/block`,
        {friendId: friendId},
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });
     
      // Update the state to reflect the blocked request
      setPendingRequests((prev) => prev.filter((f) => f.id !== friendId));
      setBlockedFriends((prev) => [...prev, { id: friendId, username: '', avatarUrl: ''  }]);// look out for here
    } catch (error) {
      console.error('Error blocking request:', error);
    }
  };

  return (
    <div>
      <h3>Pending Requests</h3>
      {pendingRequests.map((request) => (
        <div key={request.id}>
          <span style={{ color: 'black' }}>{request.sendername}</span>
          <button onClick={() => handleAcceptRequest(request.senderid)}>Accept</button>
          <button onClick={() => handleBlockRequest(request.senderid)}>Block</button>
        </div>
      ))}
      <h3>Accepted Friends</h3>
      {acceptedFriends.map((friend) => (
        <div key={friend.id}>
          <span style={{ color: 'black' }}>{friend.sendername}</span>
        </div>
      ))}
      <h3>Blocked Friends</h3>
      {blockedFriends.map((friend) => (
        <div key={friend.id}>
          <span style={{ color: 'black' }}>{friend.sendername}</span>
        </div>
      ))}
    </div>
  );
}

export default FriendRequests;
