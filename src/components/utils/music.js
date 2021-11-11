import checksound from "../../assets/sounds/Check.mp3"
import movesound from "../../assets/sounds/Move.mp3"
import capturesound from "../../assets/sounds/Capture1.mp3"
class GameSound {
    check = new Audio(checksound);
    move = new Audio(movesound);
    capture = new Audio(capturesound);
}
export default GameSound