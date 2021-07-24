class Game {
  constructor(players, room, io) {
    this.players = players;
    this.room = room;
    // this.turn = 0;
    // this.reverse = false;
    this.awal = [
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
    this.card = [...this.awal];
    // this.acak(this.card);
    this.shuffle(this.players);
    // this.updateDiscarded(this.getRandomCard(false));
    // this.playerInit();
  }

  acak(array) {
    let currentIndex = array.length;
    let randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  shuffle() {
    this.players.forEach((player) => {
      let cards = [];
      for (let i = 0; i < 7; i++) {
        cards[i] = this.getRandomCard();
      }
      player.cards = cards;
    });
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  kartu(action = true) {
    let cardLength = this.card.length;
    if (cardLength === 0) {
      this.card = [...this.awal];
      this.acak(this.card);
      return this.kartu();
    }
    let hasil, kartuRand;
    if (action) {
      hasil = this.random(0, cardLength - 2);
      kartuRand = this.card[hasil];
    } else {
      do {
        hasil = this.random(0, cardLength - 2);
        kartuRand = this.card[hasil];
      } while (
        kartuRand[0] == null ||
        kartuRand[1] == 12 ||
        kartuRand[1] == 13 ||
        kartuRand[1] == 14
      );
    }
    this.card.splice(hasil, 1);
    return kartuRand;
  }

  getRandomCard(action = true) {
    let kartu = this.kartu();
    if (!action) {
      kartu = this.kartu(false);
    } else {
      kartu = this.kartu();
    }
    let color = kartu[0];
    let value = kartu[1];
    return [color, value];
  }

  updateCardsCount() {
    let playersCard = {};
    this.players.forEach((player) => {
      playersCard.player.name = player.cards.length;
    });
    io.in(this.room).emit("updateCardsCount", playersCard);
  }
}

module.exports = Game;
