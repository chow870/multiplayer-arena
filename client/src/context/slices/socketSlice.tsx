// src/store/socketSlice.ts
import { socket } from "../../socket/socket";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface SocketState {
  connected: boolean;
}

const initialState: SocketState = {
  connected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connectSocket: (state) => {
      if (!state.connected) {
        socket.connect();
        state.connected = true;
      }
    },
    disconnectSocket: (state) => {
      if (state.connected) {
        socket.disconnect();
        state.connected = false;
      }
    },
  },
});

export const { connectSocket, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;
