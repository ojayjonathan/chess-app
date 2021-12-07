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

export class FenEditor {
  arrowMarkers = [];
  constructor(conf) {
    this.editMode = EDIT_MODE.move;
    this.fen = conf.fen;

    this.marker = {
      markerType: MARKER_TYPE.circle,
    };
    const props = {
      position: this.fen || "start", // set as fen, "start" or "empty"
      orientation: COLOR.white, // white on bottom
      style: {
        cssClass: "default",
        showCoordinates: true, // show ranks and files
        borderType: BORDER_TYPE.thin, // thin: thin border, frame: wide border with coordinates in it, none: no border
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
      if (this.editMode === EDIT_MODE.mark) {
        // if (event.type === SQUARE_SELECT_TYPE.primary) {
        //   this.marker.markerType = MARKER_TYPE.circle;
        // } else {
        // }
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
        this.board.removeMarkers(undefined, MARKER_TYPE.circle);

        if (this.editMode === EDIT_MODE.erase) {
          this.board.setPiece(event.square, null);
        } else if (this.editMode === EDIT_MODE.move) {
        } else {
          this.board.setPiece(event.square, this.editMode);
        }
        conf.onboardChange(this.board.getPosition());
      }
    });
  }
  setEditMode(mode) {
    this.editMode = mode;
  }
  setMarker(color = "", type = "") {
    this.marker.markerType = MARKER_TYPE[type];
    this.marker.color = color;
    console.log(type);
  }
  drawMarker() {
    const drawArrows = () => {
      console.log(this.arrowMarkers);
      this.arrowMarkersGroup.querySelectorAll("line").forEach((line) => {
        this.arrowMarkersGroup.removeChild(line);
      });
      this.arrowMarkers.forEach((arrow) => {
        let p1 = this.board.view.squareIndexToPoint(squareToIndex(arrow.from));
        let p2 = this.board.view.squareIndexToPoint(squareToIndex(arrow.to));
        drawArrow(this.arrowMarkersGroup, p1, p2, this.board.view.squareWidth);
      });
    };
  }
}
// board.setPiece("e4", PIECE.blackKnight)
export default FenEditor;
