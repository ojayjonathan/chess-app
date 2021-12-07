import wr from "../assets/pieces/wR.svg";
import wn from "../assets/pieces/wN.svg";
import wb from "../assets/pieces/wB.svg";
import wk from "../assets/pieces/wK.svg";
import wq from "../assets/pieces/wQ.svg";
import wp from "../assets/pieces/wP.svg";
import br from "../assets/pieces/bR.svg";
import bn from "../assets/pieces/bN.svg";
import bb from "../assets/pieces/bB.svg";
import bk from "../assets/pieces/bK.svg";
import bq from "../assets/pieces/bQ.svg";
import bp from "../assets/pieces/bP.svg";

const pieceTheme = (piece) => {
  return {
    wb,
    wk,
    wn,
    wp,
    wr,
    wq,
    bb,
    br,
    bk,
    bq,
    bp,
    bn,
  }[piece];
};

export default pieceTheme;
