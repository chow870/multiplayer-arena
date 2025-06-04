import React from "react";
import ChatList from "./ChatList";
import SelectedChatDisplay from "./SelectedChatDisplay";

function MainChat() {
  return (
    <div className="flex h-screen">
      {/* Left - Chat List */}
      <div className="w-[30%] bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>
        <ChatList />
      </div>

      {/* Right - Selected Chat Display */}
      <div className="w-[70%] flex flex-col bg-white p-4 overflow-y-auto">
        <SelectedChatDisplay />
      </div>
    </div>
  );
}

export default MainChat;
