// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import socketReducer from "./slices/socketSlice"; // Assuming you have a socket slice
import onlineUsersReducer from "./slices/onlineUsersSlice"; // Assuming you have an online users slice
import { on } from "events";
// import { socket } from "@/socket/socket";

export const store = configureStore({
  reducer: {
    user: userReducer,
    socket: socketReducer, // Assuming you have a socket slice
    onlineUsers:onlineUsersReducer
  },
});

export default store;