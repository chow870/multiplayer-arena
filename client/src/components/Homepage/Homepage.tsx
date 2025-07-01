// src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import MainHome from "./MainHome";
import { socket } from "../../socket/socket";
import { useDispatch } from "react-redux";
import {
  connectSocket,
  disconnectSocket,
} from "../../context/slices/socketSlice";
import SideBar from "../SideBar/SideBar";

function HomePage() {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = () => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 300 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
    return () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  return (
    <div className="h-screen w-full flex bg-slate-900 select-none">
      <div
        className="flex-shrink-0 relative"
        style={{ width: `${sidebarWidth}px` }}
      >
        <SideBar />

        {/* Resizer */}
        <div
          className="absolute top-0 right-0 w-1 h-full bg-slate-600 hover:bg-blue-500 cursor-col-resize transition-colors group"
          onMouseDown={startResizing}
        >
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-slate-500 group-hover:bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-w-0">
        <MainHome />
      </div>
    </div>
  );
}

export default HomePage;
