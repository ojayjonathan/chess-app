class Square {
    currentPiece;
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.init()
    }
    init() {
        this.square = document.createElement('div')
        this.square.classList += "square"
        this.square.style.backgroundColor = `var(${this.color})`
        this.square.style.width = `${this.size}px`
        this.square.style.height = `${this.size}px`
        return this.square
    }
}

export default Square