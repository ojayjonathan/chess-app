import React from "react";
import "./index.css";
import UserProfile from "./user_profile";
import { engineGame } from "../../utils/engineGame";

function Game() {
  const [state] = React.useState({
    player2: {
      profileImage: "assets/av.jpeg",
      username: "stockfish",
      time: 10,
      id: "1",
    },
    player1: {
      profileImage: "assets/av.jpeg",
      username: "Player 1",
      time: 10,
      id: "2",
    },
  });
  const [gameState, setGameState] = React.useState({
    isPlaying: false,
    isGameOver: false,
    orientation: "white",
  });

  const game = React.useRef();

  const flip = () => {
    game.current.flip();
    setGameState({
      ...gameState,
      orientation: gameState.orientation === "white" ? "black" : "white",
    });
  };

  React.useEffect(() => {
    game.current = engineGame();
  }, []);
  const [gameInfoTab, setGameInfoTab] = React.useState({
    id: 0,
    name: "moves",
  });

  return (
    <div className="game two_column_layout">
      <div className="two_column_layout__item">
        <div className="board__container">
          <div id="board"></div>
        </div>
      </div>
      <div className="align_self_stretch controls two_column_layout__item">
        <div className="controls_top">
          <span id="eval"> </span> <div> {gameInfoTab.name} </div>
          <div className="tab_controls">
            <span
              className={`material-icons ${
                gameInfoTab.id === 1 ? "tab_control_active" : ""
              }`}
              title="replay"
              onClick={() =>
                setGameInfoTab({ id: 1, name: "Game information" })
              }
            >
              info
            </span>
            <span
              className={`material-icons ${
                gameInfoTab.id === 0 ? "tab_control_active" : ""
              }`}
              title="replay"
              onClick={() => setGameInfoTab({ id: 0, name: "Game name" })}
            >
              description
            </span>
            <span
              className={`material-icons ${
                gameInfoTab.id === 2 ? "tab_control_active" : ""
              }`}
              title="replay"
              onClick={() => setGameInfoTab({ id: 2, name: "Game analysis" })}
            >
              legend_toggle
            </span>
          </div>
        </div>
        <div className="controls_bottom">
          <div className="tab_items">
            <div
              className={`move__items absolute ${
                gameInfoTab.id === 0 ? "tab_active" : ""
              }`}
              id="pgn"
            >
              no move made yet
            </div>
            <div
              className={`game_info ${
                gameInfoTab.id === 1 ? "tab_active" : ""
              }`}
              id="engineStatus"
            >
              <div>
                <span className="white"> </span>
                <UserProfile user={state.player1} />
              </div>
              <div>
                <span className="black"> </span>
                <UserProfile user={state.player2} />
              </div>
            
              {/* <div>
                <small className="my-0"> Replay the game </small>
              </div>
              <div className="text_center">
                <div>
                  <button onClick={() => game.current.replay(1000)}>
                    {" "}
                    slow{" "}
                  </button>
                  <button onClick={() => game.current.replay(700)}>
                    {" "}
                    realtime{" "}
                  </button>
                  <button onClick={() => game.current.replay(500)}>
                    {" "}
                    fast{" "}
                  </button>
                </div>
              </div> */}
            </div>
            <div
              className={`absolute ${gameInfoTab.id === 2 ? "tab_active" : ""}`}
              id="evaluation"
            >
              evaluation
            </div>
          </div>
        </div>
        <div className="game-controls" onScroll={(e) => e.preventDefault()}>
          <span
            onClick={() => game.current.undo()}
            className="material-icons"
            title="undo"
          >
            undo
          </span>
          <span onClick={flip}>
            <svg
              width="20"
              height="20"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 6.09v12l-1.29-1.3a1 1 0 0 0-1.42 1.42l3 3a1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 0-1.42a1 1 0 0 0-1.42 0L7 18.09v-12A1.56 1.56 0 0 1 8.53 4.5H11a1 1 0 0 0 0-2H8.53A3.56 3.56 0 0 0 5 6.09zm9.29-.3a1 1 0 0 0 1.42 1.42L17 5.91v12a1.56 1.56 0 0 1-1.53 1.59H13a1 1 0 0 0 0 2h2.47A3.56 3.56 0 0 0 19 17.91v-12l1.29 1.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-3-3a1 1 0 0 0-1.42 0z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="material-icons"> skip_previous </span>
          <span className="material-icons"> skip_next </span>
        </div>
      </div>
    </div>
  );
}
export default Game;
