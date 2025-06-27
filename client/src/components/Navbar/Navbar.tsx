// src/components/Navbar.tsx
import { socket } from '../../socket/socket';
import { connectSocket, disconnectSocket } from '../../context/slices/socketSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addOnlineUser, removeOnlineUser, setOnlineUsers } from '../../context/slices/onlineUsersSlice';
import axios from 'axios';

interface userData{
  avatarUrl?: string
}
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // const username = "Player123"; // Replace with actual user context
  const dispatch = useDispatch();
  // const username = useSelector((state:any) => state.user.username);
  // const userId = useSelector((state:any) => state.user.id);
  const [userData, setUserData] = useState<userData>({});
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let res = await axios.get("/api/v1/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(res.data);
      } catch (error) {
        // Handle error if needed
        console.log("error is there : ", error);
      }
    };

    fetchUserData();

    console.log(" form the navbar userEffect : User ID:", localStorage.getItem("userId")); // Debugging line to check user ID

    dispatch(connectSocket());
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("userConnected", localStorage.getItem("userId")); // Replace with actual user ID
    });

    socket.on("onlineUsers", (userList: string[]) => {
      dispatch(setOnlineUsers(userList));
    });

    socket.on("userOnline", (userId: string) => {
      dispatch(addOnlineUser(userId));
    });

    socket.on("userOffline", (userId: string) => {
      dispatch(removeOnlineUser(userId));
    });
    return () => {
      // socket.disconnect();
      dispatch(disconnectSocket());
      // console.log("Socket disconnected:", socket.id);
      // Cleanup function to disconnect the socket when the component unmounts
    };
  }, [dispatch]);

  return (
    <nav className="w-full bg-black text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/home')}>
        🎮 GameZone
      </div>
      <div className="relative">
        <img
          onClick={() => setIsOpen(!isOpen)}
          src={userData.avatarUrl || "/default-avatar.png" }
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer border border-white"
        />
        {isOpen && (
          <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg p-4 w-48 z-50 space-y-2">
            <div onClick={() => navigate('/profile')} className="hover:bg-gray-200 p-2 rounded">👤 My Profile</div>
            {/* <div onClick={() => navigate('/dashboard')} className="hover:bg-gray-200 p-2 rounded">📊 Dashboard</div> */}
            <div onClick={() => navigate('/buyPremium')} className="hover:bg-gray-200 p-2 rounded">💎 Buy Premium</div>
            <div onClick={() => navigate('/topup')} className="hover:bg-gray-200 p-2 rounded">💰 Top Up</div>
            <div onClick={() => navigate('/transactions')} className="hover:bg-gray-200 p-2 rounded">📜 Transactions</div>
            <div onClick={() => navigate('/prevGames')} className="hover:bg-gray-200 p-2 rounded">🎮 Previous Games</div>
            <div onClick={() => {
              localStorage.removeItem("Token");
              navigate('/login');
            }} className="hover:bg-red-100 text-red-600 p-2 rounded">🚪 Logout</div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
