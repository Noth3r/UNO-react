class Game {
  constructor(players, room, io) {
    this.players = players;
    this.room = room;
    // this.turn = 0;
    // this.reverse = false;
    this.awal = [];
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
