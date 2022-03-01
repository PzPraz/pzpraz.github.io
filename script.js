const player = (name, symbol) => {
  let playerName = name;
  let playerSymbol = symbol;
  return { playerName, playerSymbol };
};

let mark;

const addTile = (e) => {
  e.preventDefault();
  //determining turn
  if (GameBoard.xTurn) {
    mark = "x";
  } else if (GameBoard.circleTurn) {
    mark = "o";
  }

  //adding mark
  const symbol = document.createElement("p");
  let selectedTile = e.target;
  symbol.textContent = mark;
  symbol.classList.add("taken");
  e.target.classList.add(mark);
  selectedTile.appendChild(symbol);
  GameBoard.gameBoard.push(symbol.textContent);

  //changing turn
  if (GameBoard.xTurn) {
    GameBoard.xTurn = false;
    GameBoard.circleTurn = true;
  } else if (GameBoard.circleTurn) {
    GameBoard.circleTurn = false;
    GameBoard.xTurn = true;
  }

  if (getWinner()) {
    checkWinner(mark);
  }
};

const GameBoard = (() => {
  let gameBoard = [];

  const restartBtn = document.querySelector(".restart");
  const playerOne = document.querySelector("#p1");
  const playerTwo = document.querySelector("#p2");
  const tiles = document.querySelectorAll(".board");
  const overlay = document.querySelector(".winning");
  let xTurn = true;
  let circleTurn = false;

  tiles.forEach((tile) => {
    tile.addEventListener("click", addTile, { once: true });
  });

  const checking = () => {
    restartBtn.classList.add("checking");
  };

  return { tiles, gameBoard, xTurn, circleTurn, overlay };
})();

function getWinner() {
  const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winningCombination.some((combination) => {
    return combination.every((index) => {
      return GameBoard.tiles[index].classList.contains(mark);
    });
  });
}
