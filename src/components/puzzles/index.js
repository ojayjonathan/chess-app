import React from "react";
import "./index.css";
import ChessBoard from "../../utils/chessboard";
import PuzzleParser from "../../utils/puzzleParse";
import Chess from "chess.js";
import wK from "../../assets/images/wK.svg";
import bK from "../../assets/images/bK.svg";
import pieceTheme from "../../utils/pieceTheme";

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
  const onDrop = (source, destination) => {
    let move = chess.move({
      from: source,
      to: destination,
    });
    if (move) {
      let cMove = puzzle.getCurrentMove();
      setMove(move);
      if (cMove.from + cMove.to === source + destination) {
        board.current.highlightMove(cMove.from, cMove.to);
        puzzle.currentMove += 1;
        setSolve("Correct");
        if (!puzzle.complete()) {
          setTimeout(() => {
            chess.move(puzzle.getCurrentMove());
            board.current.position(chess.fen(), false);
            puzzle.currentMove += 1;
          }, 300);
        }
        setComplete(puzzle.complete());
      } else {
        setSolve("Incorrect");
        chess.undo();
        return "snapback";
      }
    } else {
      return "snapback";
    }
  };
  function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (chess.game_over() || puzzle.complete()) return false;
    // only pick up pieces for White
    if (!piece.includes(playerColor)) return false;
  }
  function onSnapEnd() {
    board.current.position(chess.fen(), false);
  }
  let cfg = {
    showErrors: true,
    draggable: true,
    position: "start",
    pieceTheme: pieceTheme,
    onDrop: onDrop,
    onDragStart: onDragStart,
    onSnapEnd: onSnapEnd,
    orientation: playerColor === "w" ? "white" : "black",
  };
  const viewSolution = () => {
    chess.move(puzzle.getCurrentMove());
    board.current.position(chess.fen(), false);
    puzzle.currentMove += 1;
    setSolve("Incorrect");
    if (!puzzle.complete()) {
      setTimeout(() => {
        chess.move(puzzle.getCurrentMove());
        board.current.position(chess.fen(), false);
        puzzle.currentMove += 1;
      }, 300);
    }
    setComplete(puzzle.complete());
  };
  React.useEffect(() => {
    board.current = ChessBoard("board", cfg);
    board.current.position(chess.fen(), false);
  }, []);
  return (
    <div className="puzzle two_column_layout">
      <div className="board__section two_column_layout__item">
        <div className="board__container">
          <div id="board"></div>
        </div>
      </div>
      <div className="puzzle__info two_column_layout__item">
        <div className="puzzle__theme">{puzzle.themes}</div>
        <div className="puzzle__details">
          <div className="status">
            {solve === "Your turn" ? (
              <img
                src={playerColor === "w" ? wK : bK}
                alt={`${playerColor} to move`}
                className="piece_icon"
              />
            ) : (
              <>
                {solve === "Correct" ? (
                  <good className="material-icons">done</good>
                ) : (
                  <bad className="material-icons">close</bad>
                )}
              </>
            )}
            <div>
              <div>
                {solve === "Correct" ? `${move.san} is correct` : solve}
              </div>
              {complete ? (
                <small>Sucess!</small>
              ) : (
                <small>
                  {solve === "Your turn" ? (
                    playerColor === "w" ? (
                      "white to play"
                    ) : (
                      "black to play"
                    )
                  ) : (
                    <>{solve === "Correct" ? "keep moving..." : "try again"}</>
                  )}
                </small>
              )}
            </div>
          </div>
          {complete ? (
            <button className="active">Next Puzzle</button>
          ) : (
            <button onClick={viewSolution}>View Solution</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Puzzle;
