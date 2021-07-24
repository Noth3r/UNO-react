let users = [
  {
    name: "Arya",
    id: 1,
    room: 8785,
    owner: false,
  },
  {
    name: "Sugeng",
    id: 2,
    room: 8785,
    owner: false,
  },
  {
    name: "Sugeng",
    id: 2,
    room: 8782,
    owner: true,
  },
];

// const room = 8785;
// let jumlah = 0;
// for (user of users) {
//   if (user.room == room) {
//     jumlah++;
//   }
// }
const updateUsers = (id) => {
  return users.find((user) => {
    if (user.id == id) {
      user.owner = true;
    }
  });
};

const cek = updateUsers(2);
console.log(cek);
console.log(users);
