import capture from "../assets/sounds/Capture1.mp3"
import check from "../assets/sounds/Check.mp3"
import move from "../assets/sounds/Move.mp3"
import Defeat from "../assets/sounds/Defeat.mp3"
import victory from "../assets/sounds/Victory.mp3"

const music = {
    capture: new Audio(capture),
    check: new Audio(check),
    move: new Audio(move),
    defeat: new Audio(Defeat),
    victory: new Audio(victory)

}
export default music