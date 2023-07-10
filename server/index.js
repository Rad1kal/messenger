const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();

const bodyParser = require('body-parser');
const { addUser, findUser, getRoomUsers, removeUser } = require("./users");

const server = http.createServer(app);

let users = [];

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});


io.on("connection", (socket) => {
  console.log('подключение')
  socket.on("join", ({ room, name }) => {
    socket.join(room);

    const { user, isExist } = addUser({ name, room });
    
    const userMessage = isExist
      ? `${user.name}, с возвращением`
      : `Добро пожаловать ${user.name}`;

    socket.emit("message", {
      data: { user: { name: "Admin" }, message: userMessage },
    });

    socket.broadcast.to(user.room).emit("message", {
      data: { user: { name: "Admin" }, message: `${user.name} присоединился.` },
    });

    io.to(user.room).emit("room", {
      data: { users: getRoomUsers(user.room) },
    });
    
  });

  socket.on("sendMessage", ({ message, params }) => {
    const user = findUser(params);

    if (user) {
      io.to(user.room).emit("message", { data: { user, message } });
    }
  });

  socket.on("leftRoom", ({ params }) => {
    const user = removeUser(params);

    if (user) {
      const { room, name } = user;

      io.to(room).emit("message", {
        data: { user: { name: "Admin" }, message: `${name} отключился.` },
      });

      io.to(room).emit("room", {
        data: { users: getRoomUsers(room) },
      });
      socket.leave()
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnect");
  });
});

server.listen(5006, () => {
  console.log("Server is running");
});
