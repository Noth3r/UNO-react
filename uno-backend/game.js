class Game {
  constructor(players) {
    this.players = players;
    // this.turn = 0;
    // this.reverse = false;
    // this.awal = [];
    // this.card = [...this.awal];
    // this.acak(this.card);
    this.shuffle();
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
    this.players.forEach((p) => {
      console.log(p);
      //   let cards = [];
      //   for (let i = 0; i < 7; i++) {
      //     cards[i] = this.getRandomCard();
      //   }
    });
  }
}
