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

function App() {
  return (
    <Layout>
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
