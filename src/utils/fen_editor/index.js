import {
  BORDER_TYPE,
  Chessboard,
  COLOR,
  INPUT_EVENT_TYPE,
  MARKER_TYPE,
  PIECE,
  SQUARE_SELECT_TYPE,
} from "../chessboard/Chessboard";
import pieceSet from "../../assets/images/chessboard-sprite-staunty.svg";
import { drawArrow, squareToIndex } from "..";
import css from "../../assets/styles/cm-chessboard.css";

export const EDIT_MODE = {
  move: "move",
  erase: "erase",
  wk: "wk",
  wq: "wq",
  wr: "wr",
  wb: "wb",
  wn: "wn",
  wp: "wp",
  bk: "bk",
  bq: "bq",
  br: "br",
  bb: "bb",
  bn: "bn",
  bp: "bp",
  mark: "mark",
};
const MARKER_TYPES = {
  ...MARKER_TYPE,
  arrow: "arrow",
  circleRed: { class: "markerCircleRed", slice: "markerCircle" },
};
export class FenEditor {
  arrowMarkers = [];
  constructor(conf) {
    this.editMode = EDIT_MODE.move;
    this.fen = conf.fen;
    this.arrowMarkers = [];
    this.marker = {
      markerType: MARKER_TYPE.circle,
    };
    const props = {
      position: this.fen || "start", // set as fen, "start" or "empty"
      orientation: COLOR.white, // white on bottom
      style: {
        cssClass: "default",
        showCoordinates: true, // show ranks and files
        borderType: BORDER_TYPE.frame, // thin: thin border, frame: wide border with coordinates in it, none: no border
        aspectRatio: 1, // height/width. Set to `undefined`, if you want to define it only in the css.
        moveFromMarker: MARKER_TYPE.frame, // the marker used to mark the start square
        moveToMarker: MARKER_TYPE.frame, // the marker used to mark the square where the figure is moving to
      },
      responsive: true, // resizes the board based on element size
      animationDuration: 300, // pieces animation duration in milliseconds
      sprite: {
        url: pieceSet, // pieces and markers are stored as svg sprite
        size: 40, // the sprite size, defaults to 40x40px
        cache: true, // cache the sprite inline, in the HTML
      },
    };
    this.board = new Chessboard(document.getElementById(conf.eleId), props);
    this.arrowMarkersGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    this.arrowMarkersGroup.setAttribute("class", "arrows");
    this.board.view.svg.appendChild(this.arrowMarkersGroup);
    this.board.enableMoveInput((event) => {
      if (this.editMode !== EDIT_MODE.move) {
        return false;
      }
      switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:
          return true;
        case INPUT_EVENT_TYPE.moveDone:
          return true;
        case INPUT_EVENT_TYPE.moveCanceled:
      }
    });

    this.board.enableSquareSelect((event) => {
      console.log(event);
      if (event.square) {
        if (this.marker.markerType === MARKER_TYPES.arrow) {
          if (
            this.board.getMarkers(event.square, MARKER_TYPES.circleRed).length >
            0
          ) {
            this.board.removeMarkers(event.square, MARKER_TYPES.circleRed);
            this.arrowFrom = null;
          } else {
            this.board.addMarker(event.square, MARKER_TYPES.circleRed);
            if (this.arrowFrom && event.square !== this.arrowFrom) {
              this.arrowMarkers.push({
                from: this.arrowFrom,
                to: event.square,
              });
              this.board.removeMarkers(event.square, MARKER_TYPES.circleRed);
              this.board.removeMarkers(this.arrowFrom, MARKER_TYPES.circleRed);
              this.arrowFrom = null;
              this.drawArrows();
            } else {
              this.arrowFrom = event.square;
            }
          }
        } else if (this.editMode === EDIT_MODE.mark) {
          const markersOnSquare = this.board.getMarkers(
            event.square,
            this.marker.markerType
          );
          if (markersOnSquare.length > 0) {
            this.board.removeMarkers(event.square, this.marker.markerType);
          } else {
            this.board.addMarker(event.square, this.marker.markerType);
          }
        } else {
          // this.board.removeMarkers(undefined, MARKER_TYPE.circle);

          if (this.editMode === EDIT_MODE.erase) {
            this.board.setPiece(event.square, null);
          } else if (this.editMode === EDIT_MODE.move) {
          } else {
            this.board.setPiece(event.square, this.editMode);
          }
          conf.onboardChange(this.board.getPosition());
        }
      }
    });
    this.removeMarkers.bind(this);
  }
  setEditMode(mode) {
    this.editMode = mode;
  }
  setMarker(color = "", type = "") {
    this.marker.markerType = MARKER_TYPES[type];
    this.marker.color = color;
    console.log(type);
  }
  drawArrows() {
    this.arrowMarkersGroup.querySelectorAll("line").forEach((line) => {
      this.arrowMarkersGroup.removeChild(line);
    });
    this.arrowMarkers.forEach((arrow) => {
      let p1 = this.board.view.squareIndexToPoint(squareToIndex(arrow.from));
      let p2 = this.board.view.squareIndexToPoint(squareToIndex(arrow.to));
      drawArrow(this.arrowMarkersGroup, p1, p2, this.board.view.squareWidth);
    });
  }
  removeMarkers() {
    this.arrowMarkers = [];
    this.arrowFrom = null;
    this.drawArrows();
    this.board.removeMarkers();
  }
  genUrl() {
    console.log(css);
    const clonedSvg = this.board.view.svg.cloneNode(true);
    const style = document.createElementNS("http://www.w3.org/2000/svg","style")
    style.textContent = boardStyle
    console.log(style)
    clonedSvg.appendChild(style)
    // clonedSvg.setAttribute("style", boardStyle);
    console.log(clonedSvg);
    let xml = new XMLSerializer().serializeToString(clonedSvg);
    console.log(xml);
    const blob = new Blob([xml], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const ImageFromSvg = () => {
      /*creates a new jpeg image from image object provided */
      const image = new Image();
      image.src = url;

      // document.body.appendChild(clonedSvg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.setAttribute("width", "200px");
      canvas.setAttribute("height", "200px");
      ctx.drawImage(image, 0, 0, 200, 200, 0, 0, 200, 200);
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          blob.name = "chess board.jpeg";
          resolve(blob);
        }, "image/jpeg");
      });
    };
    ImageFromSvg();
    return url;
  }
}
// board.setPiece("e4", PIECE.blackKnight)
export default FenEditor;

const boardStyle = `.cm-chessboard .board.input-enabled .square {
  cursor: pointer;
}

.cm-chessboard .markers .marker.markerFrame,
.cm-chessboard .markers .marker.marker-frame {
  stroke: black;
  stroke-width: 1.8px;
  opacity: 0.5;
}

.cm-chessboard .markers .marker.markerFrameRed,
.cm-chessboard .markers .marker.marker-frame-red {
  stroke: #aa0000;
  stroke-width: 1.8px;
  opacity: 0.4;
}

.cm-chessboard .markers .marker.markerSquare,
.cm-chessboard .markers .marker.marker-square {
  fill: #f2e982;
  opacity: 0.5;
}

.cm-chessboard .markers .marker.markerDot,
.cm-chessboard .markers .marker.marker-dot {
  fill: black;
  opacity: 0.3;
}

.cm-chessboard .markers .marker.markerCircle,
.cm-chessboard .markers .marker.marker-circle {
  stroke: #000055;
  /* stroke: #42ba96; */
  stroke-width: 3px;
  opacity: 0.4;
}

.cm-chessboard .markers .marker.markerCircleRed,
.cm-chessboard .markers .marker.marker-circle-red {
  stroke: #aa0000;
  stroke-width: 3px;
  opacity: 0.4;
}

.cm-chessboard .pieces,
.cm-chessboard .markers {
  pointer-events: none;
}

.cm-chessboard.default .board .square.white {
  fill: var(--board-sq-light);
}

.cm-chessboard.default .board .square.black {
  fill: var(--board-sq-dark);
}

.cm-chessboard.default.border-type-thin .board .border {
  stroke: var(--board-sq-dark);
  stroke-width: 0.7%;
  fill: transparent;
}

.cm-chessboard.default.border-type-frame .board .border {
  fill: var(--board-sq-light);
  stroke: none;
}

.cm-chessboard.default.border-type-frame .board .border-inner {
  fill: transparent;
  stroke: var(--board-sq-dark);
  stroke-width: 0.7%;
}

.cm-chessboard.default .coordinates {
  pointer-events: none;
  user-select: none;
}
.cm-chessboard.default .coordinates .coordinate {
  fill: var(--board-sq-dark);
  font-size: 7px;
  cursor: default;
}
.cm-chessboard.default .coordinates .coordinate.black {
  fill: var(--board-sq-light);
}
.cm-chessboard.default .coordinates .coordinate.white {
  fill: var(--board-sq-dark);
}

.cm-chessboard.green .board .square.white {
  fill: #e0ddcc;
}

.cm-chessboard.green .board .square.black {
  fill: #4c946a;
}

.cm-chessboard.green.border-type-thin .board .border {
  stroke: #4c946a;
  stroke-width: 0.7%;
  fill: transparent;
}

.cm-chessboard.green.border-type-frame .board .border {
  fill: #e0ddcc;
  stroke: none;
}

.cm-chessboard.green.border-type-frame .board .border-inner {
  fill: transparent;
  stroke: #4c946a;
  stroke-width: 0.7%;
}

.cm-chessboard.green .coordinates {
  pointer-events: none;
  user-select: none;
}
.cm-chessboard.green .coordinates .coordinate {
  fill: #4c946a;
  font-size: 7px;
  cursor: default;
}
.cm-chessboard.green .coordinates .coordinate.black {
  fill: #e0ddcc;
}
.cm-chessboard.green .coordinates .coordinate.white {
  fill: #4c946a;
}

.cm-chessboard.blue .board .square.white {
  fill: #ebf0f5;
}

.cm-chessboard.blue .board .square.black {
  fill: #678fb1;
}

.cm-chessboard.blue.border-type-thin .board .border {
  stroke: #678fb1;
  stroke-width: 0.7%;
  fill: transparent;
}

.cm-chessboard.blue.border-type-frame .board .border {
  fill: #ebf0f5;
  stroke: none;
}

.cm-chessboard.blue.border-type-frame .board .border-inner {
  fill: transparent;
  stroke: #678fb1;
  stroke-width: 0.7%;
}

.cm-chessboard.blue .coordinates {
  pointer-events: none;
  user-select: none;
}
.cm-chessboard.blue .coordinates .coordinate {
  fill: #678fb1;
  font-size: 7px;
  cursor: default;
}
.cm-chessboard.blue .coordinates .coordinate.black {
  fill: #ebf0f5;
}
.cm-chessboard.blue .coordinates .coordinate.white {
  fill: #678fb1;
}

.cm-chessboard.chess-club .board .square.white {
  fill: #e6d3b1;
}

.cm-chessboard.chess-club .board .square.black {
  fill: #af6b3f;
}

.cm-chessboard.chess-club.border-type-thin .board .border {
  stroke: #692e2b;
  stroke-width: 0.7%;
  fill: transparent;
}

.cm-chessboard.chess-club.border-type-frame .board .border {
  fill: #692e2b;
  stroke: none;
}

.cm-chessboard.chess-club.border-type-frame .board .border-inner {
  fill: transparent;
  stroke: #692e2b;
  stroke-width: 0.7%;
}

.cm-chessboard.chess-club .coordinates {
  pointer-events: none;
  user-select: none;
}
.cm-chessboard.chess-club .coordinates .coordinate {
  fill: #e6d3b1;
  font-size: 7px;
  cursor: default;
}
.cm-chessboard.chess-club .coordinates .coordinate.black {
  fill: #e6d3b1;
}
.cm-chessboard.chess-club .coordinates .coordinate.white {
  fill: #af6b3f;
}

.cm-chessboard.chessboard-js .board .square.white {
  fill: #f0d9b5;
}

.cm-chessboard.chessboard-js .board .square.black {
  fill: #b58863;
}

.cm-chessboard.chessboard-js.border-type-thin .board .border {
  stroke: #404040;
  stroke-width: 0.7%;
  fill: transparent;
}

.cm-chessboard.chessboard-js.border-type-frame .board .border {
  fill: #f0d9b5;
  stroke: none;
}

.cm-chessboard.chessboard-js.border-type-frame .board .border-inner {
  fill: transparent;
  stroke: #404040;
  stroke-width: 0.7%;
}

.cm-chessboard.chessboard-js .coordinates {
  pointer-events: none;
  user-select: none;
}
.cm-chessboard.chessboard-js .coordinates .coordinate {
  fill: #404040;
  font-size: 7px;
  cursor: default;
}
.cm-chessboard.chessboard-js .coordinates .coordinate.black {
  fill: #f0d9b5;
}
.cm-chessboard.chessboard-js .coordinates .coordinate.white {
  fill: #b58863;
}

.cm-chessboard.black-and-white .board .square.white {
  fill: #ffffff;
}

.cm-chessboard.black-and-white .board .square.black {
  fill: #9c9c9c;
}

.cm-chessboard.black-and-white.border-type-thin .board .border {
  stroke: #9c9c9c;
  stroke-width: 0.7%;
  fill: transparent;
}

.cm-chessboard.black-and-white.border-type-frame .board .border {
  fill: #ffffff;
  stroke: none;
}

.cm-chessboard.black-and-white.border-type-frame .board .border-inner {
  fill: transparent;
  stroke: #9c9c9c;
  stroke-width: 0.7%;
}

.cm-chessboard.black-and-white .coordinates {
  pointer-events: none;
  user-select: none;
}
.cm-chessboard.black-and-white .coordinates .coordinate {
  fill: #9c9c9c;
  font-size: 7px;
  cursor: default;
}
.cm-chessboard.black-and-white .coordinates .coordinate.black {
  fill: #ffffff;
}
.cm-chessboard.black-and-white .coordinates .coordinate.white {
  fill: #9c9c9c;
}

/*# sourceMappingURL=cm-chessboard.css.map */
.cm-chessboard .markers .anotateGood {
  fill: var(--active) !important;
  opacity: 1;
}
marker.markerCircleRed {
  stroke: #aa0000;
  stroke-width: 3px;
  opacity: 0.4;
}

.marker.marker-circle-green{
  stroke: #4c946a;
  stroke-width: 3px;
  opacity: 0.5;

}`;
