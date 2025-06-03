// src/pages/HomePage.tsx
import React, { useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import ChatSidebar from '../ChatSection/ChatSideBar';
import MainHome from './MainHome';
import { socket } from '../../socket/socket';
import { useDispatch } from 'react-redux';
import { connectSocket, disconnectSocket } from '../../context/slices/socketSlice';


function HomePage() {
  // here i wiil use the socket connection to set the user online status and to emit the socket event connectedd
  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar/>
      <div className="flex flex-1">
        <ChatSidebar />
        <MainHome/>
      </div>
    </div>
  );
}

export default HomePage;
