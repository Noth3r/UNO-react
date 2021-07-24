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

const addCard = (id, card) => {
  return users.find((user) => {
    if (user.id == id) {
      user.card.push(card);
    }
  });
};

const kartu = (action = true) => {
  let cardLength = card.length;
  if (cardLength === 0) {
    card = [...awal];
    acak(card);
    return kartu();
  }
  let hasil, kartuRand;
  if (!action) {
    do {
      hasil = random(0, cardLength - 2);
      kartuRand = card[hasil];
      console.log(kartuRand);
    } while (
      kartuRand[0] == null ||
      kartuRand[1] == 12 ||
      kartuRand[1] == 13 ||
      kartuRand[1] == 14
    );
  } else {
    hasil = random(0, cardLength - 2);
    kartuRand = card[hasil];
  }
  card.splice(hasil, 1);
  return kartuRand;
};

const getRandomCard = (action = true) => {
  if (!action) {
    kartus = kartu(false);
  } else {
    kartus = kartu();
  }
  let color = kartus[0];
  let value = kartus[1];
  return [color, value];
};

const awal = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [0, 9],
  [0, 10],
  [0, 11],
  [0, 12],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [0, 9],
  [0, 10],
  [0, 11],
  [0, 12],
  [null, 13],
  [null, 14],
  [1, 0],
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [1, 7],
  [1, 8],
  [1, 9],
  [1, 10],
  [1, 11],
  [1, 12],
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [1, 7],
  [1, 8],
  [1, 9],
  [1, 10],
  [1, 11],
  [1, 12],
  [null, 13],
  [null, 14],
  [2, 0],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [2, 7],
  [2, 8],
  [2, 9],
  [2, 10],
  [2, 11],
  [2, 12],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [2, 7],
  [2, 8],
  [2, 9],
  [2, 10],
  [2, 11],
  [2, 12],
  [null, 13],
  [null, 14],
  [3, 0],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [3, 7],
  [3, 8],
  [3, 9],
  [3, 10],
  [3, 11],
  [3, 12],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [3, 7],
  [3, 8],
  [3, 9],
  [3, 10],
  [3, 11],
  [3, 12],
  [null, 13],
  [null, 14],
];

const card = [...awal];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const shuffle = (users) => {
  users.forEach((user) => {
    let cards = [];
    for (let i = 0; i < 7; i++) {
      cards[i] = getRandomCard();
    }
    user.card = cards;
  });
};

// console.log(kartu());
// shuffle(users);
// console.log(getRandomCard());
// console.log(card.length);
// shuffle(users);
// console.log(users);
console.log(getRandomCard(false));
console.log(card.length);

// const cek = addCard(2, [0, 1]);
// const cek2 = addCard(2, [0, 2]);
// console.log(cek);
// console.log(users[1].card);
