// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import socketReducer from "./slices/socketSlice"; // Assuming you have a socket slice
import onlineUsersReducer from "./slices/onlineUsersSlice"; // Assuming you have an online users slice
import selectedChatReducer from "./slices/chatsSelectedRoomSlice"; // Assuming you have a selected chat slice
import selectedGameRecordReducer from "./slices/gameSelectionSlice";
import lastSelectedGameReducer from "./slices/gameLobbyJoined"



export const store = configureStore({
  reducer: {
    user: userReducer,
    socket: socketReducer, // Assuming you have a socket slice
    onlineUsers:onlineUsersReducer,
    selectChat : selectedChatReducer, // Assuming you have a selected chat slice
    selectedGameRecord : selectedGameRecordReducer,
    lastSelectedGame : lastSelectedGameReducer,
  },
});

export default store;