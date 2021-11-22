import React from "react";
import "./index.css";

function Modal() {
  return (
    <div className="modal-wrapper" id="modal">
      <div className="card">
        <div className="modal-header">
          <h4 className="heading">Modal Header</h4>
          <span className="material-icons close">close</span>
        </div>
        <div className="modal-body">
          <p>
            Simple example using the <code>:target</code> selector to open a
            modal.
          </p>
        </div>
        <div className="modal-footer">
          <button className="active">next</button>
          <button>close</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
