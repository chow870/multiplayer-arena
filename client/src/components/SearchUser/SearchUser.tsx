import React, { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  avatarUrl: string; // Assuming you have an avatar URL for each user
}

function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 0) {
      console.log(localStorage.getItem("token"));
      setLoading(true);
      axios
        .post(
          "/api/v1/search-users",
          { username: searchTerm }, // <-- actual request body
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        .then((response) => {
          setUsers(response.data.users);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setLoading(false);
        });
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  // edited the RequestToadd function to use the correct endpoint and request body : 13/4/2025
  const RequestToadd = async (userId: string) => {
    try {
      const response = await axios.post(
        "/api/v1/add-friend",
        { friendId: userId },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.status === 200) {
        console.log("Friend request sent successfully");
      } else {
        console.error("Failed to send friend request");
        alert("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Error sending friend request");
    }
  };

  const handleAddFriend = (userId: string) => {
    RequestToadd(userId);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔍</span>
          <h3 className="text-lg font-semibold text-white">Discover People</h3>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-slate-400">🔍</span>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div>
        {searchTerm.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <h4 className="text-lg font-medium text-slate-300 mb-2">
              Find New Friends
            </h4>
            <p className="text-slate-500 text-sm">
              Start typing to search for people to connect with
            </p>
          </div>
        ) : users.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">😕</span>
            </div>
            <h4 className="text-lg font-medium text-slate-300 mb-2">
              No users found
            </h4>
            <p className="text-slate-500 text-sm">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-400 mb-4">
              Found {users.length} user{users.length !== 1 ? "s" : ""}
            </p>

            {users.map((user) => (
              <div
                key={user.id}
                className="group flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors">
                    {user.username}
                  </h4>
                  <p className="text-sm text-slate-400">Available to connect</p>
                </div>

                {/* Add Friend Button */}
                <button
                  id={`${user.id}`}
                  onClick={() => handleAddFriend(user.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 opacity-0 group-hover:opacity-100"
                >
                  <span className="text-sm">+</span>
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchUsers;
