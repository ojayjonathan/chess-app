// import ChessBoard from "./chessboard";
import {
  BORDER_TYPE,
  COLOR,
  MARKER_TYPE,
  Chessboard,
  INPUT_EVENT_TYPE,
} from "./chessboard/Chessboard";
import Chess from "chess.js";
import { pieceToUnicode } from "./displayPgn";
import music from "./gameSound";
import pieceSet from "../assets/images/chessboard-sprite-staunty.svg";

const $ = (selector) => {
  const elements = document.querySelectorAll(selector);
  return {
    addClass: (cssClass) => {
      elements &&
        elements.forEach((element) => element.classList.add(cssClass));
    },
    removeClass: (cssClass) => {
      elements &&
        elements.forEach((element) => element.classList.remove(cssClass));
    },
    html: (html) => {
      elements && html && (elements[0].innerHTML = html);
    },
    text: (text) => {
      elements && text && (elements[0].textContent = text);
    },
  };
};

export const engineGame = (options) => {
  options = options || {
    showEvaluation: true,
  };
  let game = new Chess();
  let board;
  // /home/ojay/dev/web/chess_app/public/static/stockfish.min.js

  let engine = new Worker("/static/stockfish.min.js");
  let evaler = new Worker("/static/stockfish.min.js");
  let engineStatus = {};
  let displayScore = true;
  let time = { wtime: 300000, btime: 300000, winc: 2000, binc: 0 };
  let playerColor = "white";
  let clockTimeoutID = null;
  let isEngineRunning = false;
  let evaluation_el = document.getElementById("evaluation");
  let announced_game_over;
  const gameMusic = music;

  setInterval(function () {
    if (announced_game_over) {
      return;
    }

    if (game.game_over()) {
      announced_game_over = true;
      alert("Game Over");
      $("#eval").html("-");
    }
  }, 1000);

  function uciCmd(cmd, which) {
    console.log("UCI: " + cmd);

    (which || engine).postMessage(cmd);
  }
  uciCmd("uci");

  ///TODO: Eval starting posistions. I suppose the starting positions could be different in different chess letients.

  function displayStatus() {
    let status = "Engine: ";
    if (!engineStatus.engineLoaded) {
      status += "loading...";
    } else if (!engineStatus.engineReady) {
      status += "loaded...";
    } else {
      status += "ready.";
    }

    if (engineStatus.search) {
      status = engineStatus.search;
      if (engineStatus.score && displayScore) {
        status +=
          (engineStatus.score.substr(0, 4) === "Mate" ? " " : " Score: ") +
          engineStatus.score;
      }
    }
    evaluation_el.textContent = status;
    $("#eval").html(engineStatus.score);
  }

  function displayClock(color, t) {
    let isRunning = false;
    if (time.startTime > 0 && color === time.clockColor) {
      t = Math.max(0, t + time.startTime - Date.now());
      isRunning = true;
    }

    let id = color === playerColor ? "#time2" : "#time1";
    let sec = Math.ceil(t / 1000);
    let min = Math.floor(sec / 60);
    sec -= min * 60;
    let hours = Math.floor(min / 60);
    min -= hours * 60;
    let display =
      hours + ":" + ("0" + min).slice(-2) + ":" + ("0" + sec).slice(-2);

    $(id).text(display);
  }

  function updateClock() {
    displayClock("white", time.wtime);
    displayClock("black", time.btime);
    if (time.clockColor === playerColor) {
      $("#time2").addClass("clk__active");
      $("#time1").removeClass("clk__active");
    } else if (time.clockColor) {
      $("#time1").addClass("clk__active");
      $("#time2").removeClass("clk__active");
    }
  }

  function clockTick() {
    updateClock();
    let t =
      (time.clockColor === "white" ? time.wtime : time.btime) +
      time.startTime -
      Date.now();
    let timeToNextSecond = (t % 1000) + 1;
    clockTimeoutID = setTimeout(clockTick, timeToNextSecond);
  }

  function stopClock() {
    if (clockTimeoutID !== null) {
      clearTimeout(clockTimeoutID);
      clockTimeoutID = null;
    }
    if (time.startTime > 0) {
      let elapsed = Date.now() - time.startTime;
      time.startTime = null;
      if (time.clockColor === "white") {
        time.wtime = Math.max(0, time.wtime - elapsed);
      } else {
        time.btime = Math.max(0, time.btime - elapsed);
      }
    }
  }

  function startClock() {
    if (game.turn() === "w") {
      time.wtime += time.winc;
      time.clockColor = "white";
    } else {
      time.btime += time.binc;
      time.clockColor = "black";
    }
    time.startTime = Date.now();
    clockTick();
  }

  function get_moves() {
    let moves = "";
    let history = game.history({ verbose: true });

    for (let i = 0; i < history.length; ++i) {
      let move = history[i];
      moves +=
        " " + move.from + move.to + (move.promotion ? move.promotion : "");
    }

    return moves;
  }

  function prepareMove() {
    stopClock();
    $("#pgn").html(pieceToUnicode(game.pgn()));
    board.setPosition(game.fen(), false);
    updateClock();
    let turn = game.turn() === "w" ? "white" : "black";
    if (!game.game_over()) {
      uciCmd("position startpos moves" + get_moves());
      if (turn !== playerColor) {
        if (options.showEvaluation) {
          uciCmd("position startpos moves" + get_moves(), evaler);
          evaluation_el.textContent = "";
          uciCmd("eval", evaler);
        }
        if (time && time.wtime) {
          uciCmd(
            "go " +
              (time.depth ? "depth " + time.depth : "") +
              " wtime " +
              time.wtime +
              " winc " +
              time.winc +
              " btime " +
              time.btime +
              " binc " +
              time.binc
          );
        } else {
          uciCmd("go " + (time.depth ? "depth " + time.depth : ""));
        }
        isEngineRunning = true;
      }
      if (game.history().length >= 1 && !time.depth && !time.nodes) {
        startClock();
      }
    }
  }

  evaler.onmessage = function (event) {
    let line;

    if (event && typeof event === "object") {
      line = event.data;
    } else {
      line = event;
    }

    console.log("evaler: " + line);

    /// Ignore some output.
    if (
      line === "uciok" ||
      line === "readyok" ||
      line.substr(0, 11) === "option name"
    ) {
      return;
    }

    if (evaluation_el.textContent) {
      evaluation_el.textContent += "\n";
    }
    let evaluation = line.match(/^Total evaluation: (\d+(?:\.\d+)?)/);
    if (evaluation) {
      evaluation_el.textContent = evaluation[1];
    }
  };

  engine.onmessage = function (event) {
    let line;
    if (event && typeof event === "object") {
      line = event.data;
      console.log(line);
    } else {
      line = event;
    }
    console.log("Reply: " + line);
    if (line === "uciok") {
      engineStatus.engineLoaded = true;
    } else if (line === "readyok") {
      engineStatus.engineReady = true;
    } else {
      let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
      /// Did the AI move?
      if (match) {
        isEngineRunning = false;
        let move = game.move({
          from: match[1],
          to: match[2],
          promotion: match[3],
        });
        if (move) {
          highlightMove(match[1], match[2]);
          if (move.flags.includes("c")) {
            gameMusic.capture.play();
          } else {
            gameMusic.move.play();
          }
        }
        prepareMove();
        if (options.showEvaluation) {
          uciCmd("eval", evaler);
          evaluation_el.textContent = "";
        }
        //uciCmd("eval");
        /// Is it sending feedback?
      } else if ((match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))) {
        engineStatus.search = "Depth: " + match[1] + " Nps: " + match[2];
      }

      /// Is it sending feed back with a score?
      if ((match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
        let score = parseInt(match[2]) * (game.turn() === "w" ? 1 : -1);
        /// Is it measuring in centipawns?
        if (match[1] === "cp") {
          engineStatus.score = (score / 100.0).toFixed(2);
          /// Did it find a mate?
        } else if (match[1] === "mate") {
          engineStatus.score = "#" + Math.abs(score);
        }

        // /// Is the score bounded?
        // if (match = line.match(/\b(upper|lower)bound\b/)) {
        //     engineStatus.score = ((match[1] === 'upper') === (game.turn() === 'w') ? '<= ' : '>= ') + engineStatus.score
        // }
      }
    }
    displayStatus();
  };
  const highlightMove = (from, to) => {
    board.removeMarkers(undefined, MARKER_TYPE.square);
    board.addMarker(from, MARKER_TYPE.square);
    board.addMarker(to, MARKER_TYPE.square);
  };
  let onDrop = function (source, target) {
    let move = game.move({
      from: source,
      to: target,
    });

    if (move) {
      highlightMove(source, target);
      if (move.flags.includes("c")) {
        gameMusic.capture.play();
      } else {
        gameMusic.move.play();
      }
    }

    // illegal move
    if (move === null) return false;
    prepareMove();
    return true;
  };

  const props = {
    position: "start", // set as fen, "start" or "empty"
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

  board = new Chessboard(document.getElementById("board"), props);
  board.enableMoveInput((event) => {
    switch (event.type) {
      case INPUT_EVENT_TYPE.moveStart:
        return true;
      case INPUT_EVENT_TYPE.moveDone:
        return onDrop(event.squareFrom, event.squareTo);
      case INPUT_EVENT_TYPE.moveCanceled:
    }
  }, COLOR.white);
  return {
    flip: () => {
      let orientation =
        board.getOrientation() == COLOR.white ? COLOR.black : COLOR.white;
      board.setOrientation(orientation);
    },
    reset: () => {
      game.reset();
      uciCmd("setoption name Contempt value 0");
      //uciCmd('setoption name Skill Level value 20');
      this.setSkillLevel(0);
      uciCmd("setoption name King Safety value 0"); /// Agressive 100 (it's now symetric)
    },
    loadPgn: (pgn) => {
      game.load_pgn(pgn);
    },
    setPlayerColor: (color) => {
      playerColor = color;
      board.orientation(playerColor);
    },
    setSkillLevel: (skill) => {
      let max_err, err_prob;

      if (skill < 0) {
        skill = 0;
      }
      if (skill > 20) {
        skill = 20;
      }

      time.level = skill;

      /// Change thinking depth allowance.
      if (skill < 5) {
        time.depth = "1";
      } else if (skill < 10) {
        time.depth = "2";
      } else if (skill < 15) {
        time.depth = "3";
      } else {
        /// Let the engine decide.
        time.depth = "";
      }

      uciCmd("setoption name Skill Level value " + skill);

      ///NOTE: Stockfish level 20 does not make errors (intentially), so these numbers have no effect on level 20.
      /// Level 0 starts at 1
      err_prob = Math.round(skill * 6.35 + 1);
      /// Level 0 starts at 10
      max_err = Math.round(skill * -0.5 + 10);

      uciCmd("setoption name Skill Level Maximum Error value " + max_err);
      uciCmd("setoption name Skill Level Probability value " + err_prob);
    },
    setTime: (baseTime, inc) => {
      time = {
        wtime: baseTime * 1000,
        btime: baseTime * 1000,
        winc: inc * 1000,
        binc: inc * 1000,
      };
    },
    setDepth: (depth) => {
      time = { depth: depth };
    },
    setNodes: (nodes) => {
      time = { nodes: nodes };
    },
    setContempt: (contempt) => {
      uciCmd("setoption name Contempt value " + contempt);
    },
    setAggressiveness: (value) => {
      uciCmd("setoption name Aggressiveness value " + value);
    },
    setDisplayScore: (flag) => {
      displayScore = flag;
      displayStatus();
    },
    start: () => {
      uciCmd("ucinewgame");
      uciCmd("isready");
      engineStatus.engineReady = false;
      engineStatus.search = null;
      displayStatus();
      prepareMove();
      announced_game_over = false;
    },

    undo: () => {
      if (isEngineRunning) return false;
      game.undo();
      game.undo();
      engineStatus.search = null;
      displayStatus();
      prepareMove();
      return true;
    },

    replay: (duration = 300) => {
      let i = 0;
      let h = game.history();
      game.reset();
      board.setPosition(game.fen());
      const update = () => {
        if (i < h.length) {
          game.move(h[i]);
          board.setPosition(game.fen());
        } else {
          clearInterval(r);
        }
        i += 1;
      };
      const r = setInterval(update, duration);
    },
  };
};
