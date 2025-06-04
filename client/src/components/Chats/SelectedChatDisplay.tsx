import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {socket}  from '../../socket/socket'; // Adjust the import path as necessary

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
}

function SelectedChatDisplay() {
  const selectedChat = useSelector((state: any) => state.selectChat.activeRoomId); // string: roomId
  const myId = useSelector((state: any) => state.user.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/v1/chats/${selectedChat}`, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`
          }
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
      setMessages(prev => [...prev, message]);
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
    console.log(`[fronted ] Sending message: ${localStorage.getItem("username")}`, newMessage);
    const trimmedMessage = newMessage.trim();
    try {
      // Send to backend to persist
      const res = await axios.post(`/api/v1/chats/${selectedChat}`, {
        message: trimmedMessage,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

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
      setMessages(prev => [...prev, savedMessage]);
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const groupedMessages = messages.reduce((acc: any, msg) => {
    const date = dayjs(msg.timestamp).format('DD MMM YYYY');
    acc[date] = acc[date] || [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col">
      {!selectedChat ? (
        <h1 className="text-center text-gray-500 mt-8">No chat selected</h1>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100 rounded">
            {Object.entries(groupedMessages as Record<string, Message[]>).map(([date, msgs]) => (
              <div key={date}>
                <div className="text-center text-xs text-gray-500 my-2">{date}</div>
                {msgs.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === myId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-2 rounded-lg max-w-sm shadow ${msg.senderId === myId ? 'bg-blue-200' : 'bg-white'}`}>
                      <div className="text-sm">{msg.message}</div>
                      <div className="text-xs text-gray-500 text-right">
                        {dayjs(msg.timestamp).format('HH:mm')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <div className="flex p-2 border-t mt-2 bg-white">
            <input
              type="text"
              className="flex-1 border rounded px-2 py-1"
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SelectedChatDisplay;
