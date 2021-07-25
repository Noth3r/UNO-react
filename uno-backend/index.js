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

io.on("connection", (socket) => {
  socket.on(
    "login",
    ({ name, room, owner = false, playAgain = false }, callback) => {
      room = parseInt(room);
      if (playAgain) {
        if (getJumlah(room) == 0) {
          owner = true;
        }
      }
      console.log(name, room, owner, playAgain);
      const { user, error } = addUser(socket.id, name, room, owner, socket);
      if (error) return callback(error);
      socket.join(user.room);
      io.in(user.room).emit("users", getUsers(user.room));
      if (playAgain) {
        if (owner) {
          updateUsers(socket.id);
        }
      }
      callback();
    }
  );

  // socket.on("win", () => {
  //   const user = deleteUser(socket.id);
  //   console.log(user);
  //   if (user) {
  //     io.in(user.room).emit("users", getUsers(user.room));
  //   }
  // });

  // socket.on("playAgain", ({ name, room, owner = false }, callback) => {
  //   if (getJumlah == 0) {
  //     owner = true;
  //   }
  //   const { user, error } = addUser(socket.id, name, room, owner, socket);
  //   if (error) return callback(error);
  //   socket.join(user.room);
  //   io.in(user.room).emit("users", getUsers);
  //   callback();
  // });

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

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const user = deleteUser(socket.id);
    if (user) {
      // if (user.status == "Play") {
      //   io.in(user.room).emit("dc", {
      //     title: "Someone just left",
      //     description: `${user.name} terputus dari server`,
      //   });
      // } else {
      io.in(user.room).emit("notification", {
        title: "Someone just left",
        description: `${user.name} just left the room`,
        owner: user.owner,
      });
      io.in(user.room).emit("users", getUsers(user.room));
      // }
    }
  });
});

// function updateUser(room) {
//   let players = [];
//   room.forEach((p, i) => {
//     players[i] = p.name;
//   });

//   room.forEach((p) => {
//     p.emit("updateUser", players);
//   });
//   return;
// }

// let rooms = {};

// app.get("/rooms", (req, res) => {
//   res.json(Object.getOwnPropertyNames(rooms));
// });

// io.on("connection", (socket) => {
//   socket.on("username", (name) => {
//     console.log(name);
//     socket.name = name;
//     socket.roomName = "";

//     socket.on("createRoom", (roomName) => {
//       socket.roomName = roomName;
//       rooms[roomName] = [socket];
//       socket.emit("joinedRoom");
//       updateUser(rooms[roomName]);
//     });

//     socket.on("joinRoom", (roomName) => {
//       if (!rooms[roomName]) {
//         socket.emit("joinError", "Room tidak ditemukan");
//       } else {
//         if (rooms[roomName].length < 10) {
//           socket.roomName = roomName;
//           rooms[roomName].push(socket);
//           socket.emit("joinedRoom");
//           updateUser(rooms[roomName]);
//         } else {
//           socket.emit("joinError", "Room tersebut sudah full");
//         }
//       }
//     });

//     socket.on("reconnect", () => {
//       if (rooms[socket.roomName]) {
//         rooms[socket.roomName];
//         if (rooms[socket.roomName].includes(socket)) {
//           rooms[socket.roomName].splice(
//             rooms[socket.roomName].indexOf(socket),
//             1
//           );
//           if (rooms[socket.roomName].length === 0) {
//             return delete rooms[socket.roomName];
//           }
//           updateUser(rooms[socket.roomName]);
//         }
//       }
//     });

//     socket.on("disconnect", () => {
//       if (rooms[socket.roomName]) {
//         rooms[socket.roomName];
//         if (rooms[socket.roomName].includes(socket)) {
//           rooms[socket.roomName].splice(
//             rooms[socket.roomName].indexOf(socket),
//             1
//           );
//           if (rooms[socket.roomName].length === 0) {
//             return delete rooms[socket.roomName];
//           }
//           updateUser(rooms[socket.roomName]);
//         }
//       }
//     });
//   });
// });

server.listen("8000", console.log(`Server Is Running`));
