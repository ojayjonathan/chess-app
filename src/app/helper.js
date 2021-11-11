import wB from '../assets/pieces/wB.svg'
import wK from '../assets/pieces/wK.svg'
import wQ from '../assets/pieces/wQ.svg'
import wP from "../assets/pieces/wP.svg"
import wR from '../assets/pieces/wR.svg'
import wN from '../assets/pieces/wN.svg'
import bR from '../assets/pieces/bR.svg'
import bN from '../assets/pieces/bN.svg'
import bB from '../assets/pieces/bB.svg'
import bK from '../assets/pieces/bK.svg'
import bQ from '../assets/pieces/bQ.svg'
import bP from "../assets/pieces/bP.svg"

const PIECES = {
    "bB": bB,
    "bK": bK,
    "bQ": bQ,
    "bP": bP,
    "bR": bR,
    "bN": bN,
    "wB": wB,
    "wK": wK,
    "wQ": wQ,
    "wP": wP,
    "wR": wR,
    "wN": wN,

}


const loadPieceImage = (identifier) => {

    const image = new Image()
    image.src = PIECES[identifier]
    return image
}

export const displayPosition = (squares, pieceSqition) => {
    for (let i = 0; i < pieceSqition.length; i++) {
        if (squares[i].firstChild) {
            squares[i].firstChild.remove()
        }
        if (pieceSqition[i] != "-") {
            squares[i].appendChild(loadPieceImage(pieceSqition[i]))
        }
    }

}