import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  clearActiveRoom,
  setActiveRoom,
} from "../../context/slices/chatsSelectedRoomSlice"; // Adjust the import path as necessary

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
  return [userId1, userId2].sort().join("_");
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
        const response = await axios.get("https://multiplayer-arena-1.onrender.com/api/v1/friendships", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAcceptedFriends(response.data.acceptedFriends);
        setIsLoading(false);
      } catch (error) {
        alert("Error in fetching friendships");
        console.error("Error fetching friendships:", error);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading chats...</span>
        </div>
      </div>
    );
  }

  if (acceptedFriends.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-lg">💬</span>
        </div>
        <h4 className="text-sm font-medium text-slate-300 mb-2">
          No conversations yet
        </h4>
        <p className="text-xs text-slate-500">Add friends to start chatting</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-2">
        {acceptedFriends.map((friend) => {
          const { friendId, friendName, isOnline } = getFriendInfo(friend);
          const roomId = generateRoomId(myId, friendId || "");
          const isActive = tempRoomId === roomId;

          return (
            <div
              key={roomId}
              className={`group cursor-pointer p-3 rounded-xl transition-all duration-200 border ${
                isActive
                  ? "bg-blue-600/20 border-blue-500/50"
                  : "bg-slate-700/30 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500"
              }`}
              onClick={() => handleChatClick(friendId!)}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                    {friendName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  {/* Online status */}
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${
                      isOnline ? "bg-green-500" : "bg-slate-500"
                    }`}
                  />
                </div>

                {/* Chat info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-medium truncate ${
                        isActive
                          ? "text-blue-300"
                          : "text-white group-hover:text-blue-300"
                      } transition-colors`}
                    >
                      {friendName}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    Click to start chatting
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatList;
// This component will display the list of friends and their online status
