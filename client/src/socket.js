import { io } from "socket.io-client";

const socket = io("https://swapverse-back.vercel.app", {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
