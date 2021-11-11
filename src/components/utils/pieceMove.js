import { Attacks } from "../../app/attacks";

class Move {
    canCapture = [];
    constructor(board, color, piece) {
        this.color = color;
        this.piece = piece;
        this.squares = board.squares;
        this.board = board;
        this.direction = piece.color === "white" ? 1 : -1
    }
    //check if chess move to  a square is legal
    isLegalPieceMove(x, y) {
        //update squares a pawn can capture
        if (this.piece.name==="pawn") {
            this.canCapture = this.isLegalPawnMove(x, y)
        }
        //check if piece move out of the board
        if (x > 7 || x < 0 || y > 7 || y < 0) {
            return false
        }
        if (x === this.piece.x && y===this.piece.y) {
            return true
        }
        //check if square has a piece
        if (this.squares[y * 8 + x].currentPiece) {
            if (this.piece.name==="pawn") {

            }
            else if (this.piece.color != this.squares[y * 8 + x].currentPiece.color) {
                this.canCapture.push([x, y])
            }
            return false
        }

        return true
    }

    diagonal(x, y) {
        const coord = []
        for (let i = x, j = y; j < 8, i < 8; ++i, j++) {
            if (this.isLegalPieceMove(i, j)) { coord.push([i, j]); }
            else { break; }

        }
        for (let i = x, j = y; j >= 0 && i >= 0; --i, j--) {
            if (this.isLegalPieceMove(i, j)) { coord.push([i, j]); }
            else { break; }

        }
        for (let i = x, j = y; j < 8 && i >= 0; --i, j++) {
            if (this.isLegalPieceMove(i, j)) { coord.push([i, j]); }
            else { break; }
        }
        for (let i = x, j = y; j >= 0 && i < 8; ++i, j--) {
            if (this.isLegalPieceMove(i, j)) { coord.push([i, j]); }
            else { break; }
        }
        return coord.filter(c => !(c[0] === x && c[1] === y))
    }

    vertical_horizontal = (x, y) => {
        const coord = []
        for (let i = x; i < 8; ++i) {
            if (this.isLegalPieceMove(i, y)) {
                coord.push([i, y]);
            }
            else {
                break;
            }
        }
        for (let i = x; i >= 0; --i) {
            if (this.isLegalPieceMove(i, y)) {
                coord.push([i, y]);
            }
            else {
                break;
            }
        }
        for (let i = y; i < 8; ++i) {
            if (this.isLegalPieceMove(x, i)) {
                coord.push([x, i]);
            }
            else {
                break;
            }
        }
        for (let i = y; i >= 0; --i) {
            if (this.isLegalPieceMove(x, i)) {
                coord.push([x, i]);
            }
            else {
                break;
            }
        }

        return coord.filter(c => !(c[0] === x && c[1] === y))
    }

    knightMove = (x, y) => {
        const coord = []
        //up
        coord.push([x + 1, y + 2])
        coord.push([x - 1, y + 2])
        //down
        coord.push([x + 1, y - 2])
        coord.push([x - 1, y - 2])
        //right
        coord.push([x + 2, y + 1])
        coord.push([x + 2, y - 1])
        //left
        coord.push([x - 2, y + 1])
        coord.push([x - 2, y - 1])

        return coord.filter(c => this.isLegalPieceMove(c[0], c[1]))
    }

    pawnMove(x, y) {
        let coords = []
        if (this.piece.color==="white") {
            coords.push([x, y + 1])
            //check two legal pawn captures for white
            this.pawnCapture(x + 1, y + 1)
            this.pawnCapture(x - 1, y + 1)
            if (y===1) {
                if (this.isLegalPawnMove(x, y + 1)) {
                    coords.push([x, y + 2])
                }
            }
        }
        else {
            coords.push([x, y - 1])
            //check two legal pawn captures for white
            this.pawnCapture(x + 1, y - 1)
            this.pawnCapture(x - 1, y - 1)
            if (y===6) {
                if (this.isLegalPawnMove(x, y - 1)) {
                    coords.push([x, y - 2])
                }
            }
        }
        return coords.filter(c => this.isLegalPawnMove(c[0], c[1]))
    }

    kingMove(x, y) {
        const coords = []
        coords.push([x, y + 1])
        coords.push([x, y - 1])
        coords.push([x - 1, y])
        coords.push([x + 1, y])
        coords.push([x + 1, y + 1])
        coords.push([x - 1, y + 1])
        coords.push([x - 1, y - 1])
        coords.push([x + 1, y - 1])
        console.log('----original pieceSq', x + y * 8)
        coords.forEach(e => console.log(e[0] + e[1] * 8)
        )

        return coords.filter(c => this.isLegalPieceMove(c[0], c[1]))
    }
    moves() {
        switch (this.piece.name) {
            case "pawn":
                return this.pawnMove(this.piece.x, this.piece.y)
            case "rook":
                return this.vertical_horizontal(this.piece.x, this.piece.y)
            case "king":
                return this.kingMove(this.piece.x, this.piece.y);
            case "bishop":
                return this.diagonal(this.piece.x, this.piece.y)
            case "knight":
                //return Attacks.knight(this.piece.x+this.piece.y*8)
                console.log(Attacks.knight(this.piece.x + this.piece.y * 8), this.knightMove(this.piece.x, this.piece.y).map(e => e[0] + e[1] * 8))
                return this.knightMove(this.piece.x, this.piece.y)
            case "queen":
                return this.queenMove(this.piece.x, this.piece.y)
            default:
                throw "Invalid piece name"
        }
    }

    queenMove(x, y) {
        return this.diagonal(x, y).concat(this.vertical_horizontal(x, y))
    }
    isLegalPawnMove(x, y) {
        if (x > 7 || x < 0 || y > 7 || y < 0) {
            return false
        }
        if (this.squares[y * 8 + x].currentPiece) {
            return false
        }
        return true

    }
    pawnCapture(x, y) {
        if (x > 7 || x < 0 || y > 7 || y < 0) {
            return false
        }
        if (this.squares[y * 8 + x].currentPiece) {
            if (this.piece.color != this.squares[y * 8 + x].currentPiece.color) {
                this.canCapture.push([x, y])
            }
        }
    }

    legalKingMove(x, y) {
        let enemy = this.piece.color === "white" ? this.board.players.white
            : this.board.players.black


    }


}




export default Move