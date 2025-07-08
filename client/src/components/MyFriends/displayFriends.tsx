import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading friends...</span>
        </div>
      </div>
    );
  }

  if (acceptedFriends.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👥</span>
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">
          No friends yet
        </h3>
        <p className="text-slate-500 text-sm">
          Start connecting with people to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Your Friends</h3>
        <span className="text-sm text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
          {acceptedFriends.length}
        </span>
      </div>

      <div className="space-y-2">
        {acceptedFriends.map((friend) => {
          const { friendName, isOnline } = getFriendInfo(friend);

          return (
            <div
              key={friend.id}
              className="group flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                  {friendName?.charAt(0).toUpperCase() || "U"}
                </div>
                {/* Online status indicator */}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${
                    isOnline ? "bg-green-500" : "bg-slate-500"
                  }`}
                />
              </div>

              {/* Friend info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate group-hover:text-blue-300 transition-colors">
                  {friendName}
                </h4>
                <p
                  className={`text-xs ${isOnline ? "text-green-400" : "text-slate-500"}`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => alert("Chat feature coming soon!")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <span className="text-xs">💬</span>
                  Chat
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DisplayFriends;
// This component fetches and displays the list of friends, indicating their online status.
