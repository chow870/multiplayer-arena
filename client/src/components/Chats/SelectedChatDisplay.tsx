import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { socket } from "../../socket/socket"; // Adjust the import path as necessary

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
}

function SelectedChatDisplay() {
  const selectedChat = useSelector(
    (state: any) => state.selectChat.activeRoomId,
  ); // string: roomId
  const myId = useSelector((state: any) => state.user.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`https://multiplayer-arena-1.onrender.com/api/v1/chats/${selectedChat}`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();

    // Join room
    socket.emit("joinRoom", selectedChat);

    // Listen for new messages from socket
    socket.on("receiveMessage", (message: Message) => {
      // console.log(`[fronted end] Received message via socket: ${localStorage.getItem("username")} `, message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leaveRoom", selectedChat);
      socket.off("receiveMessage"); // i will stop listening to this event when component unmounts
    };
  }, [selectedChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;
    console.log(
      `[fronted ] Sending message: ${localStorage.getItem("username")}`,
      newMessage,
    );
    const trimmedMessage = newMessage.trim();
    try {
      // Send to backend to persist
      const res = await axios.post(
        `https://multiplayer-arena-1.onrender.com/api/v1/chats/${selectedChat}`,
        {
          message: trimmedMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const savedMessage = res.data.message;
      // console.log(`[fronted] : Message sent successfully:`, savedMessage);

      // Emit via socket to others
      // console.log(`the user ${localStorage.getItem("username")} is sending message via socket from room: ${selectedChat}`);
      // Emit the message to the room
      socket.emit("sendMessage", {
        user: localStorage.getItem("userId"),
        roomId: selectedChat,
        message: savedMessage.message,
      });

      // Optimistically add it to my chat
      setMessages((prev) => [...prev, savedMessage]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const groupedMessages = messages.reduce((acc: any, msg) => {
    const date = dayjs(msg.timestamp).format("DD MMM YYYY");
    acc[date] = acc[date] || [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col">
      {!selectedChat ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">
              No chat selected
            </h3>
            <p className="text-slate-500 text-sm">
              Choose a conversation to start messaging
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-700 bg-slate-800/30">
            <h3 className="font-semibold text-white">Chat Room</h3>
            <p className="text-xs text-slate-400">Room ID: {selectedChat}</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/20">
            {Object.entries(groupedMessages as Record<string, Message[]>).map(
              ([date, msgs]) => (
                <div key={date}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-slate-700/50 px-3 py-1 rounded-full">
                      <span className="text-xs text-slate-300">{date}</span>
                    </div>
                  </div>

                  {/* Messages for this date */}
                  <div className="space-y-3">
                    {msgs.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === myId ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            msg.senderId === myId
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-slate-700 text-slate-100 rounded-bl-md"
                          }`}
                        >
                          <div className="text-sm leading-relaxed">
                            {msg.message}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              msg.senderId === myId
                                ? "text-blue-200"
                                : "text-slate-400"
                            }`}
                          >
                            {dayjs(msg.timestamp).format("HH:mm")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-700 bg-slate-800/30">
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SelectedChatDisplay;
