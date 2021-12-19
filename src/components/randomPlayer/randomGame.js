import { drawArrow } from "../practice/practice";
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
import { squareToIndex } from "../../utils";

export const randomGame = (fen) => {
  let arrowState = [];
  const game = Chess();
  game.load(fen);
  const props = {
    setPosition: "start", // set as fen, "start" or "empty"
    orientation: COLOR.white, // white on bottom
    style: {
      cssClass: "default",
      showCoordinates: true, // show ranks and files
      borderType: BORDER_TYPE.frame, // thin: thin border, frame: wide border with coordinates in it, none: no border
      aspectRatio: 1, // height/width. Set to `undefined`, if you want to define it only in the css.
      moveFromMarker: MARKER_TYPE.frame, // the marker used to mark the start square
      moveToMarker: MARKER_TYPE.frame, // the marker used to mark the square where the figure is moving to
    },
    responsive: true, // resizes the board based on element size
    animationDuration: 300, // pieces animation duration in milliseconds
    sprite: {
      url: pieceSet, // pieces and markers are stored as svg sprite
      size: 40, // the sprite size, defaults to 40x40px
      cache: true, // cache the sprite inline, in the HTML
    },
  };
  const board = new Chessboard(document.getElementById("board_mini"), props);
  const arrowGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  arrowGroup.setAttribute("class", "arrows");
  board.view.svg.appendChild(arrowGroup);

  const makeMove = () => {
    let moves = game.moves({
      verbose: true,
    });
    let move = moves[Math.floor(Math.random() * moves.length)];
    let newMove = game.remove(move.from);
    game.put(newMove, move.to);
    board.setPosition(game.fen());
    board.removeMarkers(undefined, MARKER_TYPE.square);
    board.addMarker(move.from, MARKER_TYPE.square);
    board.addMarker(move.to, MARKER_TYPE.square);
  };
  const MOVE_INTERVAL = setInterval(makeMove, 2000);

  const drawArrows = () => {
    arrowGroup.querySelectorAll("line").forEach((line) => {
      arrowGroup.removeChild(line);
    });
    arrowState.forEach((arrow) => {
      let p1 = board.view.squareIndexToPoint(squareToIndex(arrow.from));
      let p2 = board.view.squareIndexToPoint(squareToIndex(arrow.to));
      drawArrow(arrowGroup, p1, p2, board.view.squareWidth);
    });
  };

  //arrowState = selectedItem.lessons[currentLesson].arrows;
  drawArrows();
  board.setPosition(game.fen());
  makeMove();
  return {
    clear: () => {
      board.destroy(3);
      window.clearInterval(MOVE_INTERVAL);
    },
  };
};
