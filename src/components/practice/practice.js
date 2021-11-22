import React from "react";
import ChessBoard from "../../utils/chessboard";
import pieceTheme from "../../utils/pieceTheme";
import Modal from "../modal";
import data from "../../assets/data/basics.json";
import { ProgressBar } from "../progress";

function PracticeLessons() {
  let board = React.useRef();
  let container = React.useRef();
  const [currentLesson, setLesson] = React.useState(0);
  let cfg = {
    draggable: true,
    // position: "start",
    pieceTheme: pieceTheme,
    onDrop: () => {},
    // position: {
    //   a1: "wR",
    // },
  };
  const selectedCategory = "Movement";
  const selectedItem = data["Movement"][0];
  const updateLesson = (i) => {
    setLesson(i);
  };
  React.useEffect(() => {
    board.current = ChessBoard("board", cfg);
    selectedItem.lessons[currentLesson].arrows.forEach((a) => {
      drawArrow(container.current, a.from, a.to);
    });
    selectedItem.lessons[currentLesson].highlighted_squares.forEach((a) => {
      board.current.highlightSquare(a);
    });
    board.current.position(selectedItem.lessons[currentLesson].position);
    return () => {
      container.current.querySelectorAll("line").forEach((line) => {
        container.current.removeChild(line);
      });
    };
  }, [currentLesson]);

  const openListItem = (id) => {
    const expanded = document.querySelector(`.list__expand`);
    const toExpand = document.querySelector(`#item-${id} ul`);
    console.log(expanded, toExpand);
    if (expanded === toExpand) return;
    else {
      toExpand.classList.replace("colapsed", "list__expand");
      if (expanded) {
        expanded.classList.replace("list__expand", "colapsed");
      }
    }
  };
  return (
    <div className="practice two_column_layout">
      {/* <Modal /> */}
      <div className="board__section two_column_layout__item">
        <div className="board__container">
          <div className="relative">
            <div id="board"></div>
            <svg className="arrows" ref={container}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="3"
                  markerHeight="3.5"
                  refX="0"
                  refY="1.75"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 3 1.75, 0 3.5"
                    fill="#e8353566 "
                    stroke="none"
                  />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
        <div className="text_center description">
          <span>{selectedItem.lessons[currentLesson].instruction}</span>
        </div>
        <ul className="page">
          <li className="page__btn">
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

          <li className="page__btn">
            <span className="material-icons">chevron_right</span>
          </li>
        </ul>
      </div>
      <div className="two_column_layout__item lessons_info">
        <div className="lessons_info__top">
          <img src={pieceTheme(selectedItem.icon)} className="piece_icon" />
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
                  <li>
                    {item.name}
                    <ProgressBar
                      progress={Math.random() * 100}
                      height={20}
                      width={150}
                    />
                  </li>
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

export const drawArrow = (parent, from, to) => {
  const parentRect = parent.getBoundingClientRect();
  const ele1 = document.querySelector(`.square-${from}`);
  const ele2 = document.querySelector(`.square-${to}`);
  const rect1 = ele1.getBoundingClientRect();
  const rect2 = ele2.getBoundingClientRect();
  let sqSize = ele1.clientWidth;
  let x1 = rect1.x - parentRect.x;
  let y1 = rect1.y - parentRect.y;
  let x2 = rect2.x - parentRect.x;
  let y2 = rect2.y - parentRect.y;
  if (x1 === x2) {
    x1 += sqSize / 2;
    x2 += sqSize / 2;
    y1 += sqSize / 2;
    y2 += y1 > y2 ? sqSize : 0;
  } else {
    x1 += sqSize / 2;
    x2 += x1 > x2 ? sqSize : 0;
    y1 += sqSize / 2;
    y2 += sqSize / 2;
  }
  console.log(x1, x2, y1, y2);
  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("id", "line2");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "#e8353566 ");
  line.setAttribute("marker-end", "url(#arrowhead)");
  line.setAttribute("stroke-width", "10");
  line.setAttribute("stroke-linecap", "round");
  parent.appendChild(line);
};
