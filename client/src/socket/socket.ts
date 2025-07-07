// src/socket.ts
// import { Socket } from "socket.io-client";
import io, { Socket } from "socket.io-client";

const URL = "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: true, // We control connection manually
  transports: ["websocket"],
});
