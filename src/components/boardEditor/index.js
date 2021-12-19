import React from "react";
import { MARKER_TYPE } from "../../utils/chessboard/Chessboard";
import FenEditor, { EDIT_MODE } from "../../utils/fen_editor";
import pieceTheme from "../../utils/pieceTheme";
import "./index.css";

function BoardEditor() {
  // b KQkq e3 0 1
  let gameInfo = {
    color: "w",
    enPassant: "-",
    fullMove: "1",
    halfMove: "0",
    bCL: "q",
    bCS: "k",
    wCL: "Q",
    wCS: "K",
    casling: "KQkq",
  };
  const [casling, setCasling] = React.useState({
    Q: "Q",
    K: "K",
    q: "q",
    k: "k",
  });
  const caslingChange = (e) => {
    let v = e.target.value;
    setCasling({ ...casling, [v]: e.target.checked ? v : "" });
    genFen(fenEditor.current.board.getPosition());
  };
  let fenEditor = React.useRef();
  const [editMode, setEditMode] = React.useState();
  const [currentFen, setCurrentFen] = React.useState();
  const updateEditMove = (mode) => {
    setEditMode(mode);
    fenEditor.current.setEditMode(mode);
  };
  const genFen = (position) => {
    const s = gameInfo;
    let casling_ = `${casling.K}${casling.Q}${casling.k}${casling.q}`;
    console.log(casling);
    return [
      position,
      s.color,
      casling_ || "-",
      s.enPassant,
      s.halfMove,
      s.fullMove,
    ].join("  ");
  };
  const boardChange = (position) => {
    setCurrentFen(genFen(position));
  };
  React.useEffect(() => {
    const conf = {
      eleId: "board",
      fen: null,
      onboardChange: boardChange,
    };
    fenEditor.current = new FenEditor(conf);
    let _position = fenEditor.current.board.getPosition();
    setCurrentFen(genFen(_position));
    setEditMode(EDIT_MODE.move);
    return () => fenEditor.current.board.destroy();
  }, []);
  const previewIMageRef = React.useRef();
  const [isPreview, setPreview] = React.useState(false);
  return (
    <div className="practice two_column_layout editor">
      <div className="board__section two_column_layout__item">
        <div className="board__container">
          <div id="board"></div>
        </div>
      </div>
      <div></div>
      <div className="align_self_stretch b_dark two_column_layout__item d_flex flex_column">
        <div className="d_flex justify_content_between edit_mode">
          <button
            className={`expand ${editMode === EDIT_MODE.move ? "active" : ""} `}
            onClick={() => updateEditMove(EDIT_MODE.move)}
          >
            Move
          </button>
          <button
            className={`expand ${
              editMode === EDIT_MODE.erase ? "active" : ""
            } `}
            onClick={() => updateEditMove(EDIT_MODE.erase)}
          >
            Erase
          </button>
        </div>
        <div className="pieces ">
          <div className="d_flex justify_content_between">
            {["wk", "wq", "wr", "wb", "wn", "wp"].map((p) => (
              <button
                onClick={() => updateEditMove(p)}
                className={`expand ${editMode === p ? "active" : ""} `}
              >
                <img key={p} src={pieceTheme(p)} className="piece_icon" />
              </button>
            ))}
          </div>
          <div className="d_flex justify_content_between">
            {["bk", "bq", "br", "bb", "bn", "bp"].map((p) => (
              <button
                onClick={() => updateEditMove(p)}
                className={`expand ${editMode === p ? "active" : ""} `}
              >
                <img key={p} src={pieceTheme(p)} className="piece_icon" />
              </button>
            ))}
          </div>
        </div>
        <div className="game_status">
          <div className="d_flex">
            <div>
              <input
                onChange={caslingChange}
                id="w-0-0"
                type="checkbox"
                defaultChecked
                value="K"
              />
              <label htmlFor="w-0-0">White O-O</label>
            </div>
            <div>
              <input
                onChange={caslingChange}
                id="w-0-0-0"
                type="checkbox"
                defaultChecked
                value="Q"
              />
              <label htmlFor="w-0-0-0">White O-O-O</label>
            </div>
          </div>
          <div className="d_flex">
            <div>
              <input
                onChange={caslingChange}
                id="b-0-0"
                type="checkbox"
                defaultChecked
                value="k"
              />
              <label htmlFor="b-0-0">Black O-O</label>
            </div>
            <div>
              <input
                onChange={caslingChange}
                id="b-0-0-0"
                type="checkbox"
                defaultChecked
                value="q"
              />
              <label htmlFor="b-0-0-0">Black O-O-O</label>
            </div>
          </div>
          <div>
            <h5 className="to_play">To Play</h5>
            <div className="d_flex">
              <div>
                <input type="radio" checked id="w" name="toPlay" value="w" />
                <label for="w">White</label>
              </div>
              <div>
                <input type="radio" id="" name="toPlay" value="b" />
                <label for="b">black</label>
              </div>
            </div>
          </div>
        </div>
        <div className="mark">
          <div className="d_flex">
            <button
              className={`expand ${
                editMode === EDIT_MODE.mark ? "active" : ""
              } `}
              onClick={() => updateEditMove(EDIT_MODE.mark)}
            >
              Add Markers
            </button>
            <button
              className="delete_btn"
              onClick={() => fenEditor.current.removeMarkers()}
            >
              Clear Markers
            </button>
          </div>

          <div
            className={`${
              editMode !== EDIT_MODE.mark ? "hidden" : ""
            } d_flex mark_options`}
          >
            <div className="d_flex flex_column justify_content_center align_items_center">
              <label htmlFor="color">Marker Color</label>
              <input type="color" id="color" value="#42ba96" />
            </div>
            <div className="expand d_flex flex_column justify_content_center align_items_center">
              <label htmlFor="mark_type">Marker Type</label>
              <select
                className="w_100"
                name="cars"
                id="mark_type"
                onChange={(e) => {
                  fenEditor.current.setMarker("", e.target.value);
                }}
              >
                <option defaultValue value="circle">
                  &#x25EF; Circle
                </option>
                <option value="arrow">&rarr; Arrow</option>
                <option value="dot">&#x2b24; Dot</option>
                <option value="frame">&#x25A2; Frame</option>
              </select>
            </div>
          </div>
        </div>
        <div className="d-flex fen">
          <div className="d_flex align_items_center w_100 ">
            <input className="w_100" value={currentFen} />
            <button
              onClick={() => {
                setPreview(true);
              }}
            >
              Share
            </button>
          </div>
        </div>
      </div>

      {isPreview && (
        <div className="preview">
          <div className="preview_card b_dark">
            <span className="preview_card__top">Preview</span>
            <div className="preview_image" ref={previewIMageRef}>
              <img src={(() => fenEditor.current.genUrl())()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardEditor;

const genPreviewImageUrl = (svgElement) => {
  console.log(svgElement);
  let xml = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const image = new Image();
  image.src = url;
  // document.body.appendChild(image);
  // return new Promise((resolve, reject) => {
  //   image.onload = async () => {
  //     ImageBlob = await ImageFromSvg(image, `chess game position.jpeg`);
  //     resolve(ImageBlob);
  //   };
  // });
  return url;
};
const ImageFromSvg = (image, fileName) => {
  /*creates a new jpeg image from image object provided */
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.setAttribute("width", "200px");
  canvas.setAttribute("height", "200px");
  ctx.drawImage(image, 0, 0, 200, 200, 0, 0, 200, 200);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      blob.name = fileName;
      resolve(blob);
    }, "image/jpeg");
  });
};
