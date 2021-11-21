import wR from "../assets/pieces/wR.svg";
import wN from "../assets/pieces/wN.svg";
import wB from "../assets/pieces/wB.svg";
import wK from "../assets/pieces/wK.svg";
import wQ from "../assets/pieces/wQ.svg";
import wP from "../assets/pieces/wP.svg";
import bR from "../assets/pieces/bR.svg";
import bN from "../assets/pieces/bN.svg";
import bB from "../assets/pieces/bB.svg";
import bK from "../assets/pieces/bK.svg";
import bQ from "../assets/pieces/bQ.svg";
import bP from "../assets/pieces/bP.svg";

const pieceTheme = (piece) => {
  return {
    wB,
    wK,
    wN,
    wP,
    wR,
    wQ,
    bB,
    bR,
    bK,
    bQ,
    bP,
    bN,
  }[piece];
};

export default pieceTheme;
