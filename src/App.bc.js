import React, { useEffect } from 'react';
import ChessBoard from './components/utils/board';
import GameSound from './components/utils/music';

import Move from './components/utils/pieceMove';

function App() {
  const boardRef = React.useRef()

  const pieceMovement = {
    initial: null,
    piece: null,
    legalMoves: [],
    final: null,
    canCapture: []
  }
  const [state, setState] = React.useState({
    board: null,
    squareSize: 0,


  })

  useEffect(() => {
    boardRef.current.style.height = `${boardRef.current.clientWidth}px`
    const board = new ChessBoard({
      sqSize: boardRef.current.clientWidth / 8,
      container: boardRef.current,
      currentColor: "white",
    })
    setState({
      ...state,
      squareSize: boardRef.current.clientWidth / 8,


    })
    board.init()
    board.squares.forEach(s => s.square.addEventListener("click", () => {
      board.squares.forEach(s => {
        s.square.classList = "square"
      })
      if (s.currentPiece) {
        clickPiece(s.currentPiece, s)
      }
      else {

        if (pieceMovement.piece && checkInclude(pieceMovement.legalMoves, [s.x, s.y])) {
          GameSound.move.play()
          movePiece(pieceMovement.initial, s, pieceMovement.piece)
          pieceMovement.initial.square.classList.add("move-from")
          s.square.classList.add("move-to")
        }
      }

    }))
    const clickPiece = (piece, sq) => {
      const move = new Move(board, "white", piece)
      if (pieceMovement.initial && checkInclude(pieceMovement.canCapture, [sq.x, sq.y])) {
        movePiece(pieceMovement.initial, sq, pieceMovement.piece)
        capture(sq)
        pieceMovement.initial = null
        GameSound.capture.play()
      }
      else {
        const ps = move.moves().concat(move.canCapture)
        pieceMovement.legalMoves = ps;
        pieceMovement.canCapture = move.canCapture
        pieceMovement.piece = piece;
        pieceMovement.initial = board.squares[piece.y * 8 + piece.x]
        board.squares[piece.y * 8 + piece.x].square.classList += " selected"
        ps.forEach(p => {
          board.squares[p[1] * 8 + p[0]].square.classList += " pm";

        })
      }

    }
    return () => {
      while (boardRef.current.firstChild) {
        boardRef.current.firstChild.remove()
      }
    }

  }, [])

  const movePiece = (from, to, piece) => {
    //from.square.firstChild.remove()
    from.currentPiece = null;
    to.currentPiece = piece;
    piece.x = to.x;
    piece.y = to.y;
    to.square.appendChild(piece.image)
  }
  const capture = (sq) => {
    sq.square.firstChild.remove()
  }
  const checkInclude = (a, b) => {
    for (let i = 0; i < a.length; i++) {
      if (a[i][0] === b[0] && a[i][1] === b[1]) {
        return true
      }
    }
    return false
  }

  return (
    <div className="App">
      <div id="board" ref={boardRef}>

      </div>
    </div>
  );
}

export default App;
