import React, { useEffect, useState } from "react";
import axios from "axios";
import AvatarUploader from "./AvatarUpload";

interface User {
  avatarUrl?: string;
  bio?: string;
  username: string;
  email: string;
  emailVerified: boolean;
  isPremium: boolean;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  rating: number;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    avatarUrl: "",
    bio: "",
    username: "",
  });
  const token = localStorage.getItem("token");  

  useEffect(() => {
    // Fetch current user (adjust endpoint if needed)
    axios.get("https://multiplayer-arena-1.onrender.com/api/v1/user/profile",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
      setUser(res.data);
      setForm({
        avatarUrl: res.data.avatarUrl || "",
        bio: res.data.bio || "",
        username: res.data.username || "",
      });
    });
  }, []);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.patch("https://multiplayer-arena-1.onrender.com/api/v1/user/profile",form,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Profile updated");
      setEditing(false);
    } catch (error) {
      alert("Update failed");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <div className="flex flex-col items-center space-y-4">
        
        <img
          src={form.avatarUrl || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />

        {editing ? (
        <>
        <AvatarUploader
         onUpload={(url :string) => setForm((prev) => ({ ...prev, avatarUrl: url }))}
         />
         <input
            type="text"
            name="avatarUrl"
            value={form.avatarUrl}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            placeholder="Avatar URL"
        />
        </>
          
        ) : null}

        <h2 className="text-xl font-semibold">{user.username}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-sm">
          Email Status:{" "}
          <span className={user.emailVerified ? "text-green-600" : "text-red-500"}>
            {user.emailVerified ? "Verified" : "Not Verified"}
          </span>
        </p>
        <p className="text-sm">
          Premium:{" "}
          <span className={user.isPremium ? "text-yellow-600" : "text-gray-500"}>
            {user.isPremium ? "Yes" : "No"}
          </span>
        </p>

        <div className="w-full">
          <label className="block text-sm font-medium">Bio:</label>
          {editing ? (
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            <p className="text-gray-700">{user.bio || "No bio added"}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <p>Games Played: {user.gamesPlayed}</p>
          <p>Games Won: {user.gamesWon}</p>
          <p>Games Lost: {user.gamesLost}</p>
          <p>Rating: {user.rating}</p>
        </div>

        {editing ? (
          <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="px-4 py-2 bg-gray-500 text-white rounded">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
