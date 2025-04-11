// src/components/ChatSidebar.tsx
import React from 'react';

function ChatSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">💬 Chats</h2>
      <ul className="space-y-2">
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Friend 1</li>
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Friend 2</li>
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">+ Add Friend</li>
      </ul>
    </div>
  );
}

export default ChatSidebar;