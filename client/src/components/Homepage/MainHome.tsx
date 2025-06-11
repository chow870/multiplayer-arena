// src/components/MainHome.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Balance from '../MyBalance/Balance';

export default function MainHome() {
  const username = localStorage.getItem("username"); // Assuming you have a user slice in your Redux store
  const userId = localStorage.getItem('userId') // Assuming you have a user ID in your Redux store
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-black text-white flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Welcome, {username} 👋</h1>
      <h1 className="text-4xl font-bold mb-4">Welcome, {userId} 👋</h1>
      <Balance/>
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