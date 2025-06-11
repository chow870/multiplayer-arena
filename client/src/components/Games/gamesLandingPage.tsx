import React from 'react';
import GameSelection from './gameSelection';
import SentMyMe from './DisplayInvites/SentMyMe';
import ReceivedInvites from './DisplayInvites/ReceivedInvites';
import { useSelector } from 'react-redux';
import Rejoin from './GameRoom/Rejoin';

function GamesLandingPage() {
  const gameLobbyId = useSelector((state: any) => state.lastSelectedGame.activeGameId);
  const isRejoining = Boolean(gameLobbyId);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

        {/* Left Panel - Game Selection */}
        <div className="col-span-4 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            🎮 Select a Game
          </h2>
          <GameSelection />
        </div>

        {/* Middle Panel - Rejoin or Invites */}
        <div className="col-span-4 space-y-6">
          {isRejoining ? (
            <div className="bg-white rounded-2xl shadow-md p-6 h-full flex flex-col justify-center items-center">
              <Rejoin />
            </div>
          ) : (
            <>
              {/* Sent Invites */}
              <div className="bg-white rounded-2xl shadow-md p-6 h-64 overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">📤 Invites Sent by Me</h2>
                <SentMyMe />
              </div>

              {/* Received Invites */}
              <div className="bg-white rounded-2xl shadow-md p-6 h-64 overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">📥 Invites Received</h2>
                <ReceivedInvites />
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Stats */}
        <div className="col-span-4 space-y-6">
          {/* Active Players */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-56">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">🧑‍🤝‍🧑 Active Players</h2>
            <p className="text-sm text-gray-500">Will be added later</p>
          </div>

          {/* Top Players */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-56">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">🏆 Top Players</h2>
            <p className="text-sm text-gray-500">Will be added later</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamesLandingPage;
