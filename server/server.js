const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
dotenv.config();
const app = express();
const server = http.createServer(app);

const cors = require("cors");

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "https://swapverse-vjn1.vercel.app",
  "https://swapverse-vjn1-git-master-mohammad-sagors-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
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
