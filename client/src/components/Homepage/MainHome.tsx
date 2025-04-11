// src/components/MainHome.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainHome() {
  const username = "Player123"; // Replace with actual user context
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-black text-white flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Welcome, {username} 👋</h1>
      <p className="text-lg mb-6">Ready for your next challenge?</p>
      <button
        onClick={() => navigate('/game')}
        className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all"
      >
        🎮 Play Game
      </button>
    </div>
  );
}