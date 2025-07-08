// FriendRequests.tsx
import axios from "axios";
import React, { useState, useEffect } from "react";
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
        const response = await axios.get("https://multiplayer-arena-1.onrender.com/api/v1/friendships", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPendingRequests(response.data.pendingRequests);
        setAcceptedFriends(response.data.acceptedFriends);
        setBlockedFriends(response.data.blockedUsers);
        setIsLoading(false);
      } catch (error) {
        alert("error in fetching the friendships");
        setIsLoading(false);
        console.log(error);
        console.error("Error fetching friendships:", error);
      }
    }
    fetchFriendships();
  }, []);

  const handleAcceptRequest = async (friendId: string | any) => {
    try {
      console.log(
        "going to hit the backend api to accept the friend request",
        friendId,
      );
      await axios.post(
        `https://multiplayer-arena-1.onrender.com/api/v1/friend-request/accept`,
        { friendId: friendId },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // Update the state to reflect the accepted request
      setPendingRequests((prev) => prev.filter((f) => f.id !== friendId));
      const acceptedFriend = pendingRequests.find((f) => f.id === friendId);
      setAcceptedFriends((prev) => [
        ...prev,
        {
          id: friendId,
          sendername: acceptedFriend?.sendername || "",
          receivername: acceptedFriend?.receivername || "",
          status: "ACCEPTED",
        },
      ]); // look out for here.
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleBlockRequest = async (friendId: string | any) => {
    try {
      await axios.post(
        `https://multiplayer-arena-1.onrender.com/api/v1/friend-request/block`,
        { friendId: friendId },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // Update the state to reflect the blocked request
      setPendingRequests((prev) => prev.filter((f) => f.id !== friendId));
      setBlockedFriends((prev) => [
        ...prev,
        { id: friendId, username: "", avatarUrl: "" },
      ]); // look out for here
    } catch (error) {
      console.error("Error blocking request:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📨</span>
          <h3 className="text-lg font-semibold text-white">Pending Requests</h3>
          {pendingRequests.length > 0 && (
            <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 bg-slate-800/20 rounded-xl border border-slate-700/50">
            <span className="text-4xl mb-3 block">📭</span>
            <p className="text-slate-400">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  {request.sendername?.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium text-white">
                    {request.sendername}
                  </h4>
                  <p className="text-sm text-slate-400">
                    Wants to be your friend
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.senderid)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleBlockRequest(request.senderid)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accepted Friends */}
      {acceptedFriends.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">✅</span>
            <h3 className="text-lg font-semibold text-white">
              Recent Connections
            </h3>
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              {acceptedFriends.length}
            </span>
          </div>

          <div className="space-y-2">
            {acceptedFriends.slice(0, 5).map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 p-3 bg-slate-800/20 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {friend.sendername?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-slate-200 font-medium">
                  {friend.sendername}
                </span>
                <span className="text-xs text-green-400 ml-auto">
                  Connected
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blocked Users */}
      {blockedFriends.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🚫</span>
            <h3 className="text-lg font-semibold text-white">Blocked Users</h3>
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
              {blockedFriends.length}
            </span>
          </div>

          <div className="space-y-2">
            {blockedFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 p-3 bg-slate-800/20 rounded-lg opacity-60"
              >
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm">
                  {friend.sendername?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-slate-400">{friend.sendername}</span>
                <span className="text-xs text-red-400 ml-auto">Blocked</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendRequests;
