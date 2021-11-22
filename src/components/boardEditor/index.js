import React from "react";
import ChessBoard from "../../utils/chessboard";
import pieceTheme from "../../utils/pieceTheme";

function BoardEditor() {
  let board = React.useRef();
  let cfg = {
    draggable: true,
    dropOffBoard: "trash",
    sparePieces: true,
    pieceTheme: pieceTheme,
    // position:"start"
  };
  React.useEffect(() => {
    board.current = ChessBoard("board", cfg);
  }, []);

  return (
    <div className="practice two_column_layout">
      <div className="board__section two_column_layout__item">
        <div className="board__container">
          <div id="board"></div>
        </div>
      </div>
    </div>
  );
}

export default BoardEditor;
