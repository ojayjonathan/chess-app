import Piece from "./piece";
import Square from "./square";
import wR from '../../assets/pieces/wR.svg'
import wN from '../../assets/pieces/wN.svg'
import wB from '../../assets/pieces/wB.svg'
import wK_ from '../../assets/pieces/wK.svg'
import wQ_ from '../../assets/pieces/wQ.svg'
import wP from "../../assets/pieces/wP.svg"
import bR from '../../assets/pieces/bR.svg'
import bN from '../../assets/pieces/bN.svg'
import bB from '../../assets/pieces/bB.svg'
import bK_ from '../../assets/pieces/bK.svg'
import bQ_ from '../../assets/pieces/bQ.svg'
import bP from "../../assets/pieces/bP.svg"
class ChessBoard {
    players = {
        black: {
            pieces: [],
            isChecked: false,
        },
        white: {
            pieces: [],
            isChecked: false,
        }
    };
    selectedPiece;
    squares = [];
    constructor({ sqSize, currentColor, container }) {
        this.playerToMove = currentColor

        this.sqSize = sqSize
        this.container = container
        this.drawSquares()
    }
    init() {
        this.initBlack()
        this.initWhite()

    }
    drawSquares() {
        for (let col = 0; col < 8; ++col) {
            let light;
            if (col % 2===0) {
                light = false;
            }
            else {
                light = true;
            }
            for (let row = 0; row < 8; ++row) {
                let color = light ? "--board-sq-light" : "--board-sq-dark";
                this.squares.push(new Square(
                    row, col, color, this.sqSize
                ))
                light = !light
            }

        }
        this.squares.map(sq => {
            this.container.appendChild(sq.square)
        })

    }
    initWhite() {
        const wR1 = new Piece(wR, "white", 0, 0, this.sqSize, "rook")
        const wN1 = new Piece(wN, "white", 1, 0, this.sqSize, "knight")
        const wB1 = new Piece(wB, "white", 2, 0, this.sqSize, "bishop")
        const wQ = new Piece(wQ_, "white", 3, 0, this.sqSize, "queen")
        const wK = new Piece(wK_, "white", 4, 0, this.sqSize, "king")
        const wB2 = new Piece(wB, "white", 5, 0, this.sqSize, "bishop")
        const wN2 = new Piece(wN, "white", 6, 0, this.sqSize, "knight")
        const wR2 = new Piece(wR, "white", 7, 0, this.sqSize, "rook")
        this.players.white.pieces = [
            wB1, wB2, wK, wQ, wR2, wN1, wN2, wR1
        ]
        for (let i = 0; i < 8; ++i) {
            this.players.white.pieces.push(
                new Piece(wP, "white", i, 1, this.sqSize, "pawn")
            )
        }
        this.players.white.pieces.map(p => {
            this.squares[p.x + (p.y * 8)].square.appendChild(p.image)
            this.squares[p.x + (p.y * 8)].currentPiece = p 
        
        })
    }
    initBlack() {
        const bR1 = new Piece(bR, "black", 0, 7, this.sqSize, "rook")
        const bN1 = new Piece(bN, "black", 1, 7, this.sqSize, "knight")
        const bB1 = new Piece(bB, "black", 2, 7, this.sqSize, "bishop")
        const bQ = new Piece(bQ_, "black", 3, 7, this.sqSize, "queen")
        const bK = new Piece(bK_, "black", 4, 7, this.sqSize, "king")
        const bB2 = new Piece(bB, "black", 5, 7, this.sqSize, "bishop")
        const bN2 = new Piece(bN, "black", 6, 7, this.sqSize, "knight")
        const bR2 = new Piece(bR, "black", 7, 7, this.sqSize, "rook")
        this.players.black.pieces = [
            bB1, bB2, bK, bQ, bR2, bN1, bN2, bR1
        ]
        for (let i = 0; i < 8; ++i) {
            this.players.black.pieces.push(
                new Piece(bP, "black", i, 6, this.sqSize,"pawn")
            )
        }
        this.players.black.pieces.map(p => {
            this.squares[p.x + (p.y * 8)].square.appendChild(p.image)
            this.squares[p.x + (p.y * 8)].currentPiece = p
        })
    }
    pieceMove() {
        this.squares.map(s => {
            s.square.addEventListener("click", (e) => {
                e.target.classList.toggle("selected")
            })
        })
    }

}

export default ChessBoard