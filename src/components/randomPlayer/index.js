import React from "react";

import {
  BORDER_TYPE,
  Chessboard,
  COLOR,
  INPUT_EVENT_TYPE,
  MARKER_TYPE,
} from "../../utils/chessboard/Chessboard";
import pieceSet from "../../assets/images/chessboard-sprite-staunty.svg";
import music from "../../utils/gameSound";
import Chess from "chess.js";
import { drawArrow } from "../practice/practice";
import { squareToIndex } from "../../utils";
import { randomGame } from "./randomGame";
function RandomPlayer({ fen }) {
  let random = React.useRef();

  React.useEffect(() => {
    random.current = randomGame(fen);
    return () => {
      random.current.clear();
    };
  }, []);
  return (
    <div id="board_mini" style={{ maxWidth: "200px", margin: "auto" }}></div>
  );
}

export default RandomPlayer;
