const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const huPlayer = "O";
const aiPlayer = "X";
let origBoard;

const gameBoard = (() => {
  const tiles = document.querySelectorAll(".board");

  return { tiles };
})();

startGame();

function startGame() {
  const overlay = document.querySelector(".winning");
  overlay.classList.remove("active");
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < gameBoard.tiles.length; i++) {
    gameBoard.tiles[i].innerHTML = "";
    gameBoard.tiles[i].addEventListener("click", turnClick, false);
    gameBoard.tiles[i].style.backgroundColor = "white";
  }
  const p1 = document.querySelector("#p1");
  const p2 = document.querySelector("#p2");

  p1.value = "";
  p2.value = "";
}

function turnClick(e) {
  e.preventDefault();
  if (typeof origBoard[e.target.id] == "number") {
    turn(e.target.id, huPlayer);
    let win = checkWin(origBoard, huPlayer);
    if (win) return false;
    if (!checkTie(huPlayer) || !checkTie(aiPlayer)) {
      turn(bestSpot(), aiPlayer);
    }
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "#2563EB" : "#DC2626";
  }
  for (let i = 0; i < gameBoard.tiles.length; i++) {
    gameBoard.tiles[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(nameInput(gameWon.player));
}

function nameInput(player) {
  const playerOne = document.querySelector("#p1");
  const playerTwo = document.querySelector("#p2");
  let winner;
  if (player == huPlayer) {
    if (playerOne.value == "") {
      return (winner = "Player 1 Wins");
    } else {
      return (winner = playerOne.value + " Wins");
    }
  }

  if (player == aiPlayer) {
    if (playerTwo.value == "") {
      return (winner = "Player 2 Wins");
    } else {
      return (winner = playerTwo.value + " Wins!");
    }
  }
}

function declareWinner(who) {
  const overlay = document.querySelector(".winning");
  overlay.classList.add("active");
  overlay.innerHTML = who;
}

function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function checkTie(player) {
  if (emptySquares().length == 0) {
    if (checkWin(origBoard, player)) return false;
    for (let i = 0; i < gameBoard.tiles.length; i++) {
      gameBoard.tiles[i].style.backgroundColor = "#16A34A";
      gameBoard.tiles[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

const restartBtn = document.querySelector(".restart");
restartBtn.onclick = startGame;

function minimax(newBoard, player) {
  let availableSpots = emptySquares(newBoard);
  if (checkWin(newBoard, player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 20 };
  } else if (availableSpots.length == 0) {
    return { score: 0 };
  }
  let moves = [];
  for (let i = 0; i < availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player == aiPlayer) {
      let result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  }
  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

const overlay = document.querySelector(".winning");
overlay.addEventListener("click", startGame);
