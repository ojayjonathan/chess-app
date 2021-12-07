import React from "react";
import "./index.css";
import { Chessboard } from "../../utils/chessboard/Chessboard";

function Home() {
  const board = React.useRef();

  React.useEffect(() => {
    board.current = new Chessboard(document.getElementById("board"));
  });
  return (
    <div className="home two_column_layout">
      <div className="board__section two_column_layout__item">
        <div className="board__container">
          <div id="board"></div>
        </div>
      </div>
      <div className="home__info two_column_layout__item">
        <h1 className="text_center">Puzzle of the day</h1>
        <div>
          <button className="home__btn_primary mx_auto">Solve</button>
          <button className="home__btn_secondary mx_auto">Learn</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
