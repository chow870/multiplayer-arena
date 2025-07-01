import React from "react";
import ChatList from "./ChatList";
import SelectedChatDisplay from "./SelectedChatDisplay";
import { useSelector } from "react-redux";

function MainChat() {
  const selectedChat = useSelector(
    (state: any) => state.selectChat.activeRoomId,
  );

  return (
    <div className="flex h-full bg-slate-800/20 rounded-xl border border-slate-700 overflow-hidden">
      {/* Left Panel - Chat List */}
      <div className="w-80 flex-shrink-0 bg-slate-800/50 border-r border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Messages</h3>
            <button className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
              <span className="text-white text-sm">💬</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChatList />
        </div>
      </div>

      {/* Right Panel - Chat Display */}
      <div className="flex-1 flex flex-col bg-slate-800/20">
        {selectedChat ? (
          <SelectedChatDisplay />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-medium text-slate-300 mb-2">
                Welcome to Messages
              </h3>
              <p className="text-slate-500">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainChat;
