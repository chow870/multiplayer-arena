import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { clearActiveRoom, setActiveRoom } from '../../context/slices/chatsSelectedRoomSlice'; // Adjust the import path as necessary

// Define the structure for friends
interface Friends {
    id: string;
    senderid?: string;
    sendername?: string;
    receiverid?: string;
    receivername?: string;    
    status?: string;
}

// Utility to generate stable room ID based on both user IDs
function generateRoomId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join('_');
}

function ChatList() {
  const onlineUsers = useSelector((state: any) => state.onlineUsers.users);
  const myId = useSelector((state: any) => state.user.id);
  const [acceptedFriends, setAcceptedFriends] = useState<Friends[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const tempRoomId = useSelector((state: any) => state.selectChat.selectedChat);

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

  const handleChatClick = (friendId: string) => {
    const roomId = generateRoomId(myId, friendId);
    // You can now navigate to the chat component, or emit a socket join, etc.
    console.log("Clicked chat room:", roomId);
    dispatch(clearActiveRoom()); // Assuming you have an action to set the active room
    dispatch(setActiveRoom(roomId)); // Assuming you have an action to set the active room
    console.log("Selected chat ID: [tempRoomId] : ", tempRoomId);


    // Example: dispatch(setActiveRoom(roomId)) or navigate(`/chat/${roomId}`)
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Your Friends</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {acceptedFriends.map((friend) => {
            const { friendId, friendName, isOnline } = getFriendInfo(friend);
            const roomId = generateRoomId(myId, friendId || '');

            return (
              <li
                key={roomId}
                className="flex justify-between items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-100"
                onClick={() => handleChatClick(friendId!)}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{friendName}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    title={isOnline ? "Online" : "Offline"}
                  ></span>
                </div>
                <div className="text-xs text-gray-400">Room: {roomId}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ChatList;
// This component will display the list of friends and their online status