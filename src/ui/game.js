import React from 'react'
import "./index.css"
import UserProfile from './user_profile'
import GameControls from './gameControls'
import { engineGame } from '../utils/engineGame'


function Game() {
    const [state, setState] = React.useState({
        player1: {
            profileImage: "assets/av.jpeg",
            username: "stockfish",
            time: 10,
            id:"1"
        },
        player2: {
            profileImage: "assets/av.jpeg",
            username: "ojay",
            time: 10,
            id:"2"
        },
        wWidth: window.innerWidth,


    })
    const [gameState, setGameState] = React.useState({
        isPlaying: false,
        isGameOver: false,
        orientation: "white"
    })
    window.addEventListener("resize", () => {
        setState({ ...state, wWidth: window.innerWidth })
    })
    const [game, setGame] = React.useState();
    const undo = () => {
        game.undo()
    }
    const redo = () => {
    }
    const replay = () => {
        game.replay()
    }
    const flip = () => {
        game.flip()
        setGameState({
            ...gameState,
            orientation: gameState.orientation === "white" ? 'black' : "white"
        })
    }

    React.useEffect(() => {
        if (!game) {
            // engineGame({ player: "w" }).start()
            let g = engineGame({ player: "w" });
            g.start();
            setGame(g);
            setGameState({ ...gameState, orientation: "white" })

        }

    }, [])
    return (
        <div className="game">
            <div className="board__section">
                <UserProfile
                    user={gameState.orientation === "white" ? state.player1 : state.player2}
                   
                />
                <div className="board__container">
                    <div id="board" >
                    </div>
                </div>
                <UserProfile
                    user={gameState.orientation === "white" ? state.player1 : state.player2}
                    
                />
            </div>
            <div className="controls">
                <div className="desc">
                    <span id="eval">0.0</span>
                    <div id="evaluation">stating position</div>
                    <span className="cntl_btn" onClick={flip} >
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" ariaHidden="true" role="img" width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M5 6.09v12l-1.29-1.3a1 1 0 0 0-1.42 1.42l3 3a1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 0-1.42a1 1 0 0 0-1.42 0L7 18.09v-12A1.56 1.56 0 0 1 8.53 4.5H11a1 1 0 0 0 0-2H8.53A3.56 3.56 0 0 0 5 6.09zm9.29-.3a1 1 0 0 0 1.42 1.42L17 5.91v12a1.56 1.56 0 0 1-1.53 1.59H13a1 1 0 0 0 0 2h2.47A3.56 3.56 0 0 0 19 17.91v-12l1.29 1.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-3-3a1 1 0 0 0-1.42 0z" fill="currentColor" /></svg>
                    </span>

                </div>
                <div className="moves">
                    <div className="evaluation">
                        <div id="engineStatus">
                        </div><br />
                        <div className="move__items" id="pgn">
                        </div>
                    </div>
                </div>
                <GameControls replay={replay} undo={undo} />
            </div>
        </div>
    )
}

export default Game



export const pieceToUnicode = (p) => {
    if (!p) return ""
    // ♔♕♖♗♘♙ ♚♛♜♝♞♟
    return p.replaceAll('N', "♞").
        replaceAll('Q', '♛').
        replaceAll('B', "♝").
        replaceAll('R', "♜").
        replaceAll('K', "♚")
}

