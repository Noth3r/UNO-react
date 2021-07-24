let users = [];

const addUser = (id, name, room, owner) => {
  room = parseInt(room);
  const existingRoom = users.find((user) => user.room === room);
  let jumlah = 0;
  for (use of users) {
    if (use.room == room) {
      jumlah++;
    }
  }

  if (!(jumlah < 10)) return { error: "Room tersebut sudah full" };
  if (!owner) {
    if (!existingRoom) return { error: "Room tidak ditemukan" };
  }
  if (!name && !room) return { error: "Name and Room are required" };
  if (!name) return { error: "Username is required" };
  if (existingRoom?.status == "Play")
    return { error: "Room Sudah Memulai Permainan" };

  const user = { id, name, room, owner };
  users.push(user);
  return { user };
};

const getUser = (id) => {
  let user = users.find((user) => user.id == id);
  return user;
};

const deleteUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUsers = (room) => users.filter((user) => user.room === room);

const updateUsers = (id) => {
  return users.find((user) => {
    if (user.id == id) {
      user.owner = true;
    }
  });
};

const getJumlah = (room) => {
  let jumlah = 0;
  for (use of users) {
    if (use.room == room) {
      jumlah++;
    }
  }
  return jumlah;
};

const deleteRoom = (room) => {
  const players = users.filter((user) => user.room == room);
  for (i in players) {
    const index = users.findIndex((user) => user.id == players[i].id);
    if (index !== -1) users.splice(index, 1)[0];
  }
  return users;
};

const playStatus = (room) => {
  const players = users.filter((user) => user.room == room);
  for (i in players) {
    players[i].status = "Play";
  }
};

module.exports = {
  addUser,
  getUser,
  deleteUser,
  getUsers,
  updateUsers,
  getJumlah,
  deleteRoom,
  playStatus,
};
