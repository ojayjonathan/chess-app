import Layout from "./components/layout/layout";
import Game from "./components/playComputer/game";
import "./board.css";
import Home from "./components/home";
import Puzzle from "./components/puzzles";
import { Routes, Route } from "react-router-dom";
import Practice from "./components/practice";
import { APP_ROUTES } from "./utils/constants";
import Basics from "./components/practice/basics";
import PracticeLessons from "./components/practice/practice";
import BoardEditor from "./components/boardEditor";
import "./assets/styles/cm-chessboard.css";
import "./assets/styles/main.css";

export const moveAnotation = { class: "anotateGood", slice: "anotation" };

function App() {
  return (
    <Layout>
      <svg height="0" width="0">
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
        <g id="anotation" transform="">
          <circle cx="12" cy="12" r="12" />
          <path
            fill="#fff"
            d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"
          />{" "}
        </g>
      </svg>

      <Routes>
        {/* {let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });} */}
        <Route path={APP_ROUTES.playComputer} element={<Game />} />
        <Route path={APP_ROUTES.puzzles} element={<Puzzle />} />
        <Route path={APP_ROUTES.practice} element={<Practice />} />
        <Route path={APP_ROUTES.basics} element={<Basics />} />
        <Route path={APP_ROUTES.lessons} element={<PracticeLessons />} />
        <Route path={APP_ROUTES.home} element={<Home />} />
        <Route path={APP_ROUTES.boardEditor} element={<BoardEditor />} />
      </Routes>
    </Layout>
  );
}

export default App;
