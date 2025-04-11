// src/pages/HomePage.tsx
import React from 'react';
import Navbar from '../Navbar/Navbar';
import ChatSidebar from '../ChatSection/ChatSideBar';
import MainHome from './MainHome';


function HomePage() {
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
