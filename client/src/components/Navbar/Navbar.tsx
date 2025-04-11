// src/components/Navbar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const username = "Player123"; // Replace with actual user context

  return (
    <nav className="w-full bg-black text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/home')}>
        🎮 GameZone
      </div>
      <div className="relative">
        <img
          onClick={() => setIsOpen(!isOpen)}
          src="/avatar.png"
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer border border-white"
        />
        {isOpen && (
          <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg p-4 w-48 z-50 space-y-2">
            <div onClick={() => navigate('/profile')} className="hover:bg-gray-200 p-2 rounded">👤 My Profile</div>
            <div onClick={() => navigate('/dashboard')} className="hover:bg-gray-200 p-2 rounded">📊 Dashboard</div>
            <div onClick={() => navigate('/premium')} className="hover:bg-gray-200 p-2 rounded">💎 Buy Premium</div>
            <div onClick={() => navigate('/wallet')} className="hover:bg-gray-200 p-2 rounded">💰 Top Up</div>
            <div onClick={() => navigate('/transactions')} className="hover:bg-gray-200 p-2 rounded">📜 Transactions</div>
            <div onClick={() => navigate('/games')} className="hover:bg-gray-200 p-2 rounded">🎮 Previous Games</div>
            <div onClick={() => {
              localStorage.removeItem("jwtToken");
              navigate('/login');
            }} className="hover:bg-red-100 text-red-600 p-2 rounded">🚪 Logout</div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;