import React from "react";
import "./index.css";
import PuzzleParser from "../../utils/puzzleParse";
import Chess from "chess.js";
import wK from "../../assets/images/wK.svg";
import bK from "../../assets/images/bK.svg";
import {
  BORDER_TYPE,
  Chessboard,
  COLOR,
  INPUT_EVENT_TYPE,
  MARKER_TYPE,
} from "../../utils/chessboard/Chessboard";
import pieceSet from "../../assets/images/chessboard-sprite-staunty.svg";





function Puzzle() {
  const board = React.useRef();
  const [solve, setSolve] = React.useState("Your turn");
  const puzzle = new PuzzleParser(
    "0000D,5rk1/1p3ppp/pq3b2/8/8/1P1Q1N2/P4PPP/3R2K1 w - - 2 27,d3d6 f8d8 d6d8 f6d8,1521,73,96,8483,advantage endgame,https://lichess.org/F8M8OS71#53"
  );
  const [complete, setComplete] = React.useState(false);
  const chess = Chess(puzzle.fen);
  chess.move(puzzle.getCurrentMove());
  puzzle.currentMove += 1;
  const [playerColor] = React.useState(chess.turn());
  const [move, setMove] = React.useState({});
  const highlightMove = (from, to) => {
    board.current.removeMarkers(undefined, MARKER_TYPE.square);
    board.current.addMarker(from, MARKER_TYPE.square);
    board.current.addMarker(to, MARKER_TYPE.square);
  };
  const onDrop = (source, destination) => {
    let move = chess.move({
      from: source,
      to: destination,
    });
    if (move) {
      let cMove = puzzle.getCurrentMove();
      setMove(move);
      if (cMove.from + cMove.to === source + destination) {
        highlightMove(cMove.from, cMove.to);
        puzzle.currentMove += 1;
        setSolve("Correct");
        board.current.setPosition(chess.fen(), false);

        if (!puzzle.complete()) {
          setTimeout(() => {
            let move = chess.move(puzzle.getCurrentMove());
            board.current.setPosition(chess.fen(), false);
            highlightMove(move.from, move.to);
            puzzle.currentMove += 1;
          }, 300);
        }
        setComplete(puzzle.complete());
      } else {
        setSolve("Incorrect");
        chess.undo();
        return false;
      }
    } else {
      return false;
    }
  };
  function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (chess.game_over() || puzzle.complete()) return false;
    // only pick up pieces for White
    if (!piece.includes(playerColor)) return false;
  }

  let props = {
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

  React.useEffect(() => {
    board.current = new Chessboard(document.getElementById("board"), props);
    board.current.setOrientation(playerColor);
    board.current.setPosition(chess.fen());
    board.current.enableMoveInput((event) => {
      switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:
          // markPosibleMoves(event.square);
          return true;
        case INPUT_EVENT_TYPE.moveDone:
          return onDrop(event.squareFrom, event.squareTo);
        case INPUT_EVENT_TYPE.moveCanceled:
      }
    }, playerColor);

    return () => {
      board.current.destroy();
    };
  }, []);

  const viewSolution = () => {
    chess.move(puzzle.getCurrentMove());
    board.current.position(chess.fen(), false);
    puzzle.currentMove += 1;
    setSolve("Retry");
    setComplete(true);
  };

  return (
    <div className="puzzle two_column_layout">
      <div className="board__section two_column_layout__item">
        <div className="board__container">
          <div id="board"></div>
        </div>
      </div>
      <div className="puzzle__info align_self_stretch b_dark two_column_layout__item d_flex flex_column">
        <div
          className={`puzzle__top ${
            solve === "Correct" ? "good" : solve === "Incorrect" ? "bad" : ""
          }`}
        >
          {solve === "Correct" && (
            <>
              <span className="material-icons">done</span>
              <div>
                <span>{`${move.san} Is correct`}</span>
                <small>{complete ? "Sucess!" : "keep going.."}</small>
              </div>
            </>
          )}
          {solve === "Incorrect" && (
            <>
              <span className="material-icons">close</span>
              <div>
                <span>{`${move.san} Incorrect `}</span>
                <small>try again</small>
              </div>
            </>
          )}
          {solve === "Your turn" && (
            <>
              <img
                src={playerColor === "w" ? wK : bK}
                alt={`${playerColor} to move`}
                className="piece_icon"
              />
              <div>
                <span>Your turn</span>
                <small>
                  {playerColor === "w" ? "white to play" : "black to play"}
                </small>
              </div>
            </>
          )}
          {solve === "Retry" && (
            <>
              <span className="material-icons">autorenew</span>
              <div>
                <span>Retry</span>
                <small>try again</small>
              </div>
            </>
          )}
        </div>
        <div className="expand">
          <div className="card_dark">
            <div className="d_flex align_items_center justify_content_between">
              <h3>Opening</h3>
              <span className="material-icons">
                keyboard_double_arrow_right
              </span>
            </div>
            <span className="text__muted">lorem</span>
          </div>
        </div>
        <div className="d_flex">
          {complete ? (
            <button className="active expand light_btn">
              <span className="material-icons">east</span>
            </button>
          ) : (
            <button
              onClick={viewSolution}
              className="expand d_flex justify_content_center align_items_center"
            >
              <span className="material-icons">help_outline</span>
              &nbsp; view solution
            </button>
          )}
          <button>
            <span className="material-icons">info</span>
          </button>
          <button>
            <span className="material-icons">settings</span>
          </button>
        </div>
        <div className="tool_bar">
          <span className="material-icons">settings</span>
          <span className="material-icons">settings</span>
        </div>
      </div>
    </div>
  );
}

export default Puzzle;
