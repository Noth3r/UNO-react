class Game {
  constructor(players, room, io, socket) {
    this.socket = socket;
    this.io = io;
    this.players = players;
    this.room = room;
    this.turn = 0;
    this.reverse = false;
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
    // this.chat();
    this.acak(this.card);
    this.shuffle(this.players);
    this.updateDiscarded(this.getRandomCard(false));
    this.playerInit();
  }

  playerInit() {
    this.players.forEach((player) => {
      this.updateCards(player);
      this.io
        .in(this.room)
        .emit("msg", this.players[0].name + " sedang berjalan");
      player.socket.on("play", (index) => {
        if (isNaN(index)) {
          this.play(player, index[0], index[1]);
        } else {
          this.play(player, index);
        }
      });
      player.socket.on("draw", () => {
        this.draw(player);
      });
      player.socket.on("disconnect", () => {
        this.io.in(this.room).emit("dc", {
          title: "Someone just left",
          description: `${player.name} terputus dari server`,
        });
      });
    });
  }

  play(player, cardIndex, cardHitam = null) {
    if (player === this.players[this.turn]) {
      let card = player.cards[cardIndex];
      if (this.checkCard(card)) {
        player.cards.splice(cardIndex, 1);
        if (card[1] >= 13) {
          card[0] = cardHitam;
          this.updateTurn();
          this.updateDiscarded(card);
          this.updateCards(player);
        } else {
          if (card[1] === 11) {
            if (this.players.length > 2) {
              this.reverse = !this.reverse;
            } else {
              this.updateTurn();
            }
          }
          if (card[1] === 10) {
            this.updateTurn();
            this.updateTurn();
          } else {
            this.updateTurn();
          }
          this.updateDiscarded(card);
          this.updateCards(player);
        }
      }
    }
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
      playersCard[player.name] = player.cards.length;
    });
    this.io.in(this.room).emit("updateCardsCount", playersCard);
  }

  updateCards(player) {
    this.io.in(player.id).emit("updateCards", player.cards);
    if (player.cards.length === 0) {
      this.io.in(this.room).emit("end", player.name);
      this.updateCardsCount();
      this.players.forEach((player) => {
        player.socket.removeAllListeners("play");
        player.socket.removeAllListeners("draw");
        player.socket.removeAllListeners("disconnect");
      });
    } else {
      this.updateCardsCount();
    }
  }

  updateDiscarded(card) {
    this.discarded = card;
    if (card[1] === 12) {
      for (let i = 0; i < 2; i++) {
        this.players[this.turn].cards.push(this.getRandomCard());
      }
      this.updateCards(this.players[this.turn]);
      this.io
        .in(this.room)
        .emit("alert", this.players[this.turn].name + " mengambil 2 kartu");
      this.updateTurn();
    } else if (card[1] === 14) {
      for (let i = 0; i < 4; i++) {
        this.players[this.turn].cards.push(this.getRandomCard());
      }
      this.updateCards(this.players[this.turn]);
      this.io
        .in(this.room)
        .emit("alert", this.players[this.turn].name + " mengambil 4 kartu");
      this.updateTurn();
    }
    this.io.in(this.room).emit("updateDiscarded", this.discarded);
  }

  updateTurn() {
    if (!this.reverse) {
      if (this.turn < this.players.length - 1) {
        this.turn++;
      } else {
        this.turn = 0;
      }
    } else {
      if (this.turn > 0) {
        this.turn--;
      } else {
        this.turn = this.players.length - 1;
      }
    }
    this.io
      .in(this.room)
      .emit("msg", this.players[this.turn].name + " sedang berjalan");
  }

  checkCard(card) {
    if (card[1] < 13) {
      if (card[0] === this.discarded[0]) return true;
      if (card[1] === this.discarded[1]) return true;
      return false;
    }
    return true;
  }

  draw(player) {
    if (player === this.players[this.turn]) {
      let card = this.getRandomCard();
      player.cards.push(card);
      this.io.in(this.room).emit("alert", player.name + " mengambil kartu");
      this.updateCards(player);
      this.updateTurn();
    }
  }
}

module.exports = Game;
