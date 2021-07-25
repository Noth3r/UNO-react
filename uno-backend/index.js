const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const Game = require("./game");
const {
  addUser,
  getUser,
  deleteUser,
  getUsers,
  updateUsers,
  getJumlah,
  deleteRoom,
  playStatus,
} = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

io.on("connection", (socket) => {
  let rooms;
  socket.on("chatSend", (data) => {
    io.in(rooms).emit("chatComing", data);
  });

  socket.on(
    "login",
    ({ name, room, owner = false, playAgain = false }, callback) => {
      room = parseInt(room);
      if (playAgain) {
        if (getJumlah(room) == 0) {
          owner = true;
        }
      }
      rooms = room;
      const { user, error } = addUser(socket.id, name, room, owner, socket);
      if (error) return callback(error);
      socket.join(user.room);
      if (playAgain) {
        if (owner) {
          io.in(user.id).emit("changeOwner");
        } else {
          io.in(user.id).emit("notOwner");
        }
      }
      io.in(user.room).emit("users", getUsers(user.room));
      callback();

      socket.on("disconnect", () => {
        const user = deleteUser(socket.id);
        if (user) {
          if (user.status == "Play") {
            io.in(user.room).emit("dc", {
              title: "Someone just left",
              description: `${user.name} terputus dari server`,
            });
          } else {
            const players = getUsers(user.room);
            const rand = random(0, players.length - 1);
            for (i in players) {
              if (i == rand) {
                io.in(players[i].id).emit("notification", {
                  title: "Someone just left",
                  description: `${user.name} just left the room`,
                  owner: user.owner,
                });
              } else {
                io.in(user.room).emit("notification", {
                  title: "Someone just left",
                  description: `${user.name} just left the room`,
                  owner: false,
                });
              }
            }
          }
          io.in(user.room).emit("users", getUsers(user.room));
        }
      });
    }
  );

  socket.on("start", () => {
    const user = getUser(socket.id);
    const users = getUsers(user.room, true);
    if (users.length >= 2 && users.length < 10) {
      io.in(user.room).emit("play");
      new Game(users, user.room, io, socket);
      playStatus(user.room);
      deleteRoom(user.room);
    } else {
      io.in(user.id).emit("notification", {
        title: "Pemain tidak cukup",
      });
    }
  });

  socket.on("changeOwner", () => {
    updateUsers(socket.id);
  });
});

server.listen("8000", console.log(`Server Is Running`));
