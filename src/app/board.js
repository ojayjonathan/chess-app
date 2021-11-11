class Board {
    squares = [];
    Pieces = []
    isDragging = false;
    STARTING_POSITION = ""
    currentPosition;
    toPlay;
    holdPiece;

    constructor({ container, fen }) {
        this.container = container;
        this.container.style.height = container.clientWidth + 4 + "px";
        this.sqSize = this.container.clientWidth / 8
        this.boardBackground = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        this.boardBackground.setAttribute("viewBox", "0 0 100 100")
        this.boardBackground.style.cssText = "overflow: hidden;pointer-events:none; position:absolute;top:0;left:0;width:100%;height:100%;"
        container.appendChild(this.boardBackground)
        this.rect = this.container.getBoundingClientRect();
        this.dragPiece.bind(this)

        this.flip = false;
        this.init()
        this.position(fen)
        this.Pieces.forEach(p => {
            this.dragPiece(p)

        })
        this.container.addEventListener("click", (e) => {
            console.log(this.holdPiece)
            if (this.holdPiece) {
                let x = e.clientX - this.rect.left
                let y = e.clientY - this.rect.top
                this.holdPiece.x = this.clip(Math.round((x) / this.sqSize)) * this.sqSize
                this.holdPiece.y = this.clip(Math.round((y) / this.sqSize)) * this.sqSize
                this.holdPiece = null;
            }
        })
    }
    init() {
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
                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
                rect.setAttribute("x", row * 100 / 8)
                rect.setAttribute("y", col * 100 / 8)
                rect.setAttribute("fill", `var(${color})`)
                rect.setAttribute("width", 100 / 8)
                rect.setAttribute("height", 100 / 8)
                this.boardBackground.appendChild(rect)


                // this.squares.push(square)
                light = !light
            }

        }
    }
    clip(n) {
        return Math.min(Math.max(n, 0), 7)
    }

    dragPiece(p) {
        if (this.toPlay !== p.color) return;
        var x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        // console.log(translateX, translateY)

        let sqSize = this.sqSize;
        const closeDragPiece = () => {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            if (this.isDragging) {
                this.holdPiece = null;
            }
            this.isDragging = false
            p.x = this.clip(Math.round((p.x) / sqSize)) * sqSize
            p.y = this.clip(Math.round((p.y) / sqSize)) * sqSize
            p.ele.style.transform = `translate(${p.x}px,${p.y}px) rotateX(${this.flip ? 0 : 180}deg)`
        }
        const PieceDrag = (e) => {
            this.isDragging = true;
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            x1 = x2 - e.clientX;
            y1 = y2 - e.clientY;
            x2 = e.clientX;
            y2 = e.clientY;
            // set the Piece's new position:
            p.x += p.ele.offsetLeft - x1
            p.y -= p.ele.offsetTop - y1
            p.ele.style.transform = `translate(${p.x}px,${p.y}px) rotateX(${this.flip ? 0 : 180}deg)`

        }
        const dragMouseDown = (e) => {
            this.holdPiece = p;
            // this.isDragging = true
            p.ele.classList.add("selected")
            e = e || window.event;
            // e.preventDefault();
            // get the mouse cursor position at startup:
            x2 = e.clientX;
            y2 = e.clientY;
            this.container.onmouseup = closeDragPiece;

            // call a const whenever the cursor moves:
            document.onmousemove = PieceDrag;
            document.ontouchend = closeDragPiece;


        }
        //move piece by clicking

        p.ele.onclick = (e) => {
            console.log(e)
            this.holdPiece = p;
        };
        p.ele.addEventListener("mousedown", dragMouseDown)

    }
    position(fen) {
        //"rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq Nc3 1 2"
        const tokens = fen.split(/\s+/)
        this.toPlay = tokens[1]
        let posString = tokens[0].split(/\//).reverse().join("")
        let pos = 0

        for (let i = 0; i < posString.length; ++i) {
            //check for blackPieces
            if (parseInt(posString[i])) {
                pos += parseInt(posString[i])
            }
            else {
                let row = pos % 8
                let col = Math.floor(pos / 8)
                let color;
                let square = document.createElement('piece')
                square.style.width = this.sqSize + "px"
                square.style.height = this.sqSize + "px"
                square.style.transform = `translate(${row * this.sqSize}px,${col * this.sqSize}px) rotateX(${this.flip ? 0 : 180}deg)`
                square.draggable="true"
                //black pieces
                if (posString[i].toLowerCase() === posString[i]) {
                    square.classList.add('b' + posString[i])
                    color = "b"
                }
                else {
                    square.classList.add('w' + posString[i].toLowerCase())
                    color = "w"

                }
                pos += 1
                this.container.appendChild(square)
                this.Pieces.push(new Piece(row * this.sqSize, col * this.sqSize, square, color))
            }
        }
    }


}
class Piece {
    constructor(x, y, ele, color) {
        this.currentX = x;
        this.currentY = y;
        this.ele = ele;
        this.x = x;
        this.y = y;
        this.color = color;
        
    }
}

export default Board