class PuzzleParser {
  //   if (move === null) return "snapback";
  // 00008,r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24,f2g3 e6e7 b2b1 b3c1 b1c1 h6c1,1788,76,92,456,crushing hangingPiece long middlegame,https://lichess.org/787zsVup/black#48
  puzzleId;
  fen;
  moves = [];
  rating;
  ratingDeviation;
  popularity;
  nbPlays;
  themes;
  gameUr;
  constructor(puzzleString) {
    let tokens = puzzleString.split(",");
    this.puzzleId = tokens[0];
    this.fen = tokens[1];
    this.moves = tokens[2].split(/\s+/);
    this.rating = tokens[3];
    this.ratingDeviation = tokens[4];
    this.popularity = tokens[5];
    this.nbPlays = tokens[6];
    this.themes = tokens[7];
    this.gameUr = tokens[8];
    this.currentMove = 0;
  }
  getCurrentMove() {
    let match = this.moves[this.currentMove].match(
      /([a-h][1-8])([a-h][1-8])([qrbn])?/
    );
    return { from: match[1], to: match[2], promotion: match[3] };
  }
  complete() {
    return this.currentMove === this.moves.length;
  }
}
export default PuzzleParser;
