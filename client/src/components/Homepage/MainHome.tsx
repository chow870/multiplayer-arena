// src/components/MainHome.tsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Balance from "../MyBalance/Balance";
import MainBlog from "../blogs/mainBlog";

export default function MainHome() {
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header Section */}
      <header className="w-full border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome back, {username}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Ready for your next challenge?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <div className="bg-slate-700/50 rounded-lg p-1">
                <Balance />
              </div>
              <button
                onClick={() => navigate("/game")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="text-lg">🎮</span>
                Play Games
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="w-full max-w-none">
          {/* Blog Section - 70% width */}
          <div className="w-full">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 shadow-2xl">
              <h2 className="text-xl font-semibold mb-6 text-slate-200">
                Community Blogs
              </h2>
              <div className="w-full">
                <MainBlog />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
