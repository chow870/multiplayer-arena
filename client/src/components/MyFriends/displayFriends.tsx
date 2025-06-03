import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store'; // Adjust import path if needed

interface Friends {
  id: string;
  senderid?: string;
  sendername?: string;
  receiverid?: string;
  receivername?: string;    
  status?: string;
}

function DisplayFriends() {
  const [acceptedFriends, setAcceptedFriends] = useState<Friends[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const onlineUsers = useSelector((state: any) => state.onlineUsers.users);
  const myId = useSelector((state: any) => state.user.id);

  useEffect(() => {
    async function fetchFriendships() {
      try {
        const response = await axios.get('/api/v1/friendships', {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAcceptedFriends(response.data.acceptedFriends);
        setIsLoading(false);
      } catch (error) {
        alert("Error in fetching friendships");
        console.error('Error fetching friendships:', error);
        setIsLoading(false);
      }
    }

    fetchFriendships();
  }, []);

  const getFriendInfo = (friend: Friends) => {
    const isSender = friend.senderid !== myId;
    const friendId = isSender ? friend.senderid : friend.receiverid;
    const friendName = isSender ? friend.sendername : friend.receivername;
    const isOnline = onlineUsers.includes(friendId || "");

    return { friendId, friendName, isOnline };
  };

  return (
    <>
      <h2>Your Friends</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {acceptedFriends.map((friend) => {
            const { friendName, isOnline } = getFriendInfo(friend);

            return (
              <li key={friend.id}>
                {friendName}{" "}
                {isOnline ? (
                  <span className="text-green-500"> (Online)</span>
                ) : (
                  <span className="text-red-500"> (Offline)</span>
                )}
                <button onClick={()=>alert("the feature will be added later on")}>Chat</button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default DisplayFriends;
// This component fetches and displays the list of friends, indicating their online status.