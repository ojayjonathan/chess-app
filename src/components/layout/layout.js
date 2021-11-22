import React from "react";
import "./layout.css";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../utils/constants";

function Layout({ children }) {
  const openSideBar = () => {
    document.querySelector(".sidebar").classList.toggle("open");
  };
  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sidebar__top">
          <ul>
            <li className="header">Learn</li>
            <li>
              <Link to={APP_ROUTES.basics}>
                <span className="material-icons">lightbulb</span> Basics
              </Link>
            </li>
            <li>
              <Link to={APP_ROUTES.practice}>
                <span className="material-icons">self_improvement</span>{" "}
                Practice
              </Link>
            </li>
            <li>
              <Link to={APP_ROUTES.puzzles}>
                <span className="material-icons">track_changes</span> Puzzles
              </Link>
            </li>
          </ul>

          <ul>
            <li className="header">Play</li>
            <li>
              <Link to={APP_ROUTES.playComputer}>
                <span className="material-icons">computer</span> Computer
              </Link>
            </li>
          </ul>
          <ul>
            <li className="header">Your Stats</li>
            <li>
              <Link to={APP_ROUTES.stat}>
                <span className="material-icons">cloud_download</span>Import
                Games
              </Link>
            </li>
          </ul>

          <ul>
            <li className="header">Tools</li>
            <li>
              <Link to={APP_ROUTES.createPuzzle}>
                <span className="material-icons">add_circle_outline</span>Create
                puzzle
              </Link>
            </li>
            <li>
              <Link to={APP_ROUTES.boardEditor}>
                <span className="material-icons">grid_view</span>Board editor
              </Link>
            </li>
          </ul>
        </div>
        <div className="profile">
          {/* <div>
            <span
              className="profile__img"
              style={{ backgroundImage: `url(${profile})` }}
            ></span>
          </div> */}
          <span>Player 1</span>
          <span className="material-icons">settings</span>
        </div>
      </div>
      <div className="sidebar__offset main">
        <nav className="navar">
          <div className="sidebar__open">
            <i className="material-icons" onClick={openSideBar}>
              menu
            </i>
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
}

export default Layout;
