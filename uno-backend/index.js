const express = require("express");
const http = require("http");
const socketio = require("socket.io");
// const Game = require("./Game");
const {
  addUser,
  getUser,
  deleteUser,
  getUsers,
  updateUsers,
  getJumlah,
} = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  socket.on("login", ({ name, room, owner = false }, callback) => {
    const { user, error } = addUser(socket.id, name, room, owner);
    if (error) return callback(error);
    console.log(user);
    socket.join(user.room);
    socket.in(user.room).emit("joinedRoom", {
      name: user.name,
      owner: owner,
    });
    io.in(user.room).emit("users", getUsers(user.room));
    callback();
  });

  socket.on("start", () => {
    const user = getUser(socket.id);
    const jumlahPlayer = get;
  });

  socket.on("changeOwner", () => {
    updateUsers(socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const user = deleteUser(socket.id);
    if (user) {
      console.log(user.room);
      io.in(user.room).emit("notification", {
        title: "Someone just left",
        description: `${user.name} just left the room`,
        owner: user.owner,
      });
      io.in(user.room).emit("users", getUsers(user.room));
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
