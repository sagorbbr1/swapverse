const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
  });

  socket.on("send_message", ({ roomId, message }) => {
    io.to(roomId).emit("message_received", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = { server, app };
