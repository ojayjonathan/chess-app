class Piece {
    constructor(imageSrc, color, x, y, size, name) {
        this.color = color;
        this.name = name
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = imageSrc
        this.image.style.width = `${size}px`
        this.image.style.height = `${size}px`
    }

}
export default Piece