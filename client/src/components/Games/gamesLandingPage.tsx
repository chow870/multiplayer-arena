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
    <div className="flex h-screen p-4 gap-4 bg-gray-100">
      {/* Left - Game Selection */}
      <div className="w-2/5 bg-white p-4 rounded-2xl shadow-md overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Select a Game</h2>
        <GameSelection />
      </div>

      {/* Middle - Rejoin Button */}
      {isRejoining && <Rejoin />}

      {/* Middle-right - Players Panels */}
      <div className="w-1/5 flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-md h-1/2">
          <h2 className="text-lg font-semibold">Active Players</h2>
          <p className="text-sm text-gray-500">Will be added later</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md h-1/2">
          <h2 className="text-lg font-semibold">Top Players</h2>
          <p className="text-sm text-gray-500">Will be added later</p>
        </div>
      </div>

      {/* Right - Invites */}
      <div
        className={`w-2/5 flex flex-col gap-4 transition-opacity duration-300 ${
          isRejoining ? 'opacity-40 pointer-events-none' : ''
        }`}
      >
        {/* Sent Invites */}
        <div className="bg-white rounded-2xl p-4 shadow-md flex-1 overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Invites Sent by Me</h2>
          <div className="max-h-64 overflow-y-auto pr-2">
            <SentMyMe />
          </div>
        </div>

        {/* Received Invites */}
        <div className="bg-white rounded-2xl p-4 shadow-md flex-1 overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Invites Received</h2>
          <div className="max-h-64 overflow-y-auto pr-2">
            <ReceivedInvites />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamesLandingPage;
