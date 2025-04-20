import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  withCredentials: true,
  transports: ["websocket"],
  reconnectionAttempts: 5,
});

export default socket;
