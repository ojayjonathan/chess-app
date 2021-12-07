import React from "react";
import "./index.css";

function Modal({ children, title }) {
  return (
    <div className="modal-wrapper" id="modal">
      <div className="card">
        <div className="modal-header">
          <h4 className="heading expand text_center">{title}</h4>
          <span className="material-icons close">close</span>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="active">next</button>
          <button>close</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
