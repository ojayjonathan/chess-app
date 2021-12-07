import React from "react";
import pieceTheme from "../../utils/pieceTheme";
import data from "../../assets/data/basics.json";
import {
  BORDER_TYPE,
  Chessboard,
  COLOR,
  INPUT_EVENT_TYPE,
  MARKER_TYPE,
} from "../../utils/chessboard/Chessboard";
import pieceSet from "../../assets/images/chessboard-sprite-staunty.svg";
import music from "../../utils/gameSound";
import Chess from "chess.js";
import rook from "../../assets/data/rook.json";
import { moveAnotation } from "../../App";
import { drawArrow, squareToIndex } from "../../utils";

function PracticeLessons() {
  let board = React.useRef();
  let arrowState = [];
  let highlightedSquare;
  let arrowGroup = React.useRef();
  let timeId;
  const game = Chess();

  const [currentLesson, setLesson] = React.useState(0);
  const markPosibleMoves = (from) => {
    let moves = game.moves({
      square: from,
      verbose: true,
    });
    board.current.removeMarkers(undefined, MARKER_TYPE.dot);
    moves.forEach((move) => board.current.addMarker(move.to, MARKER_TYPE.dot));
  };
  const solveSucess = (sq) => {
    if (sq === highlightedSquare) {
      // board.current.addMarker(sq, moveAnotation);
      board.current.removeMarkers(undefined, MARKER_TYPE.circle);
    }
  };
  const randomMove = () => {
    board.current.removeMarkers(undefined, undefined);
    let moves = game.moves({
      verbose: true,
    });
    let move = moves[Math.floor(Math.random() * moves.length)];
    let newMove = game.remove(move.from);
    moves.map((m) => {
      board.current.addMarker(m.to, MARKER_TYPE.circle);
    });
    setTimeout(() => {
      game.put(newMove, move.to);
      board.current.setPosition(game.fen());
      board.current.addMarker(move.from, MARKER_TYPE.square);
      board.current.addMarker(move.to, MARKER_TYPE.square);
      setTimeout(() => {
        board.current.removeMarkers(undefined, MARKER_TYPE.circle);
      }, 300);
    }, 1500);

    timeId = window.setTimeout(randomMove, 3000);
  };
  let onDrop = function (source, target) {
    let moves = game.moves({
      square: source,
      verbose: true,
    });
    board.current.removeMarkers(undefined, MARKER_TYPE.dot);
    solveSucess(target);
    for (let i = 0; i < moves.length; i++) {
      if (target === moves[i].to) {
        let move = game.remove(source);
        game.put(move, target);
        music.move.play();
        return true;
      }
    }

    return false;
  };
  const drawArrows = () => {
    arrowGroup.current.querySelectorAll("line").forEach((line) => {
      arrowGroup.current.removeChild(line);
    });
    arrowState.forEach((arrow) => {
      let p1 = board.current.view.squareIndexToPoint(squareToIndex(arrow.from));
      let p2 = board.current.view.squareIndexToPoint(squareToIndex(arrow.to));
      drawArrow(arrowGroup.current, p1, p2, board.current.view.squareWidth);
    });
  };

  const selectedCategory = "Movement";
  const selectedItem = rook;
  const updateLesson = (i) => {
    setLesson(i);
  };
  const next = () => {
    setLesson(Math.min(currentLesson + 1, selectedItem.lessons.length - 1));
  };

  const prev = () => {
    setLesson(Math.max(currentLesson - 1, 0));
  };
  React.useEffect(() => {
    const props = {
      setPosition: "start", // set as fen, "start" or "empty"
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
    let fen = selectedItem.lessons[currentLesson].fen;
    game.load(fen);
    board.current = new Chessboard(document.getElementById("board"), props);
    board.current.setPosition(game.fen());
    if (selectedItem.lessons[currentLesson].action !== false) {
      board.current.enableMoveInput((event) => {
        switch (event.type) {
          case INPUT_EVENT_TYPE.moveStart:
            markPosibleMoves(event.square);
            return true;
          case INPUT_EVENT_TYPE.moveDone:
            return onDrop(event.squareFrom, event.squareTo);
          case INPUT_EVENT_TYPE.moveCanceled:
        }
      }, COLOR.white);
    }
    arrowGroup.current = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    if (selectedItem.lessons[currentLesson].action === "random_move") {
      timeId = window.setTimeout(randomMove, 2000);
    } else if (selectedItem.lessons[currentLesson].action === "try_easy") {
      let moves = game.moves({
        verbose: true,
      });
      let rMove = moves[Math.floor(Math.random() * moves.length)];
      highlightedSquare = rMove.to;
      highlightedSquare &&
        board.current.addMarker(highlightedSquare, MARKER_TYPE.circle);
      arrowState = [
        {
          from: rMove.from,
          to: rMove.to,
        },
      ];
    } else if (selectedItem.lessons[currentLesson].action === "try_hard") {
      if (!selectedItem.lessons[currentLesson].moveTo) {
        let moves = game.moves({
          verbose: true,
        });
        highlightedSquare = moves[Math.floor(Math.random() * moves.length)].to;
      } else {
        highlightedSquare = selectedItem.lessons[currentLesson].moveTo;
      }
      board.current.addMarker(highlightedSquare, MARKER_TYPE.circle);
    }
    arrowGroup.current.setAttribute("class", "arrows");
    board.current.view.svg.appendChild(arrowGroup.current);
    // arrowState = selectedItem.lessons[currentLesson].arrows;
    drawArrows();
    // selectedItem.lessons[currentLesson].highlighted_squares.forEach((a) => {
    //   board.current.addMarker(a, MARKER_TYPE.circle);
    // });

    return () => {
      board.current.destroy();
      window.clearTimeout(timeId);
    };
  }, [currentLesson]);

  const openListItem = (id) => {
    const expanded = document.querySelector(`.list__expand`);
    const toExpand = document.querySelector(`#item-${id} ul`);
    toExpand.classList.replace("colapsed", "list__expand");
    if (expanded) {
      expanded.classList.replace("list__expand", "colapsed");
    }
  };
  return (
    <div className="practice two_column_layout">
      <div className="board__section two_column_layout__item">
        <ul className="page">
          <li className="page__btn" onClick={prev}>
            <span className="material-icons">chevron_left</span>
          </li>
          {selectedItem.lessons.map((lesson, i) => (
            <li
              onClick={() => updateLesson(i)}
              className={`page__numbers ${
                currentLesson === i ? "active_item" : ""
              } `}
            >
              {i + 1}
            </li>
          ))}

          <li className="page__btn" onClick={next}>
            <span className="material-icons">chevron_right</span>
          </li>
        </ul>
        <div className="board__container">
          <div id="board"></div>
        </div>
        <p className="description">
          <span>{selectedItem.lessons[currentLesson].instruction}</span>
        </p>
      </div>
      <div className="two_column_layout__item lessons_info">
        <div className="lessons_info__top">
          <img src={pieceTheme("wr")} className="piece_icon" />
          <div>
            <span className="d_block">{selectedItem.name}</span>
            <small>{selectedItem.description}</small>
          </div>
        </div>

        <div>
          {Object.keys(data).map((key, i) => (
            <div
              className={`tile ${
                key === selectedCategory ? "active_tile" : ""
              }`}
              key={i}
              onClick={() => openListItem(i)}
              id={`item-${i}`}
            >
              {console.log(selectedCategory)}
              <div>{key}</div>
              <ul className="colapsed ">
                {data[key].map((item) => (
                  <li>{item.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PracticeLessons;
