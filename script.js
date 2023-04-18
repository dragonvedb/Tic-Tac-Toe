const Player = (name, token, color) => {
  const getName = () => name;
  const getToken = () => token;
  const getColor = () => color;

  return { getName, getToken, getColor };
};

const playerOne = Player("Player X", "cross", "blue");
const playerTwo = Player("Player O", "circle", "red");

const gameController = (() => {
  let turnCounter = 1;
  const getCurrentTurn = () => turnCounter;

  let currentPlayer = playerOne;
  const getCurrentPlayer = () => currentPlayer;
  const switchPlayer = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    turnCounter += 1;
    displayController.updateMessage(
      `${currentPlayer.getName()}, make your move.`,
      currentPlayer.getColor()
    );
  };

  const declareWinner = (winnerNum) => {
    const winner = winnerNum === 1 ? playerOne : playerTwo;
    console.log(winner.getName());
  };

  const victoryCheck = () => {
    const board = gameBoard.getBoard();
    const linesArr = [
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[2][0], board[1][1], board[0][2]],
    ];

    function checkLine(line) {
      let leader = null;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === 0) return null;
        if (line[i] !== 0 && leader === null) {
          leader = line[i];
        } else if (line[i] !== leader) return null;
      }
      return leader;
    }

    for (let i = 0; i < linesArr.length; i++) {
      const winner = checkLine(linesArr[i]);
      if (winner) {
        return declareWinner(winner);
      }
    }
  };

  return { getCurrentTurn, getCurrentPlayer, switchPlayer, victoryCheck };
})();

const gameBoard = (() => {
  const board = [];

  for (let i = 0; i < 3; i++) {
    board.push([]);
    for (let x = 0; x < 3; x++) {
      board[i].push(0);
    }
  }

  const getBoard = () => board;

  const setToken = (cellRow, cellCol) => {
    const player = gameController.getCurrentPlayer();

    if (board[cellRow][cellCol] === 0) {
      board[cellRow][cellCol] = player === playerOne ? 1 : 2;
      displayController.updateBoard();
      console.log(gameBoard.getBoard());
      if (gameController.getCurrentTurn() >= 5) gameController.victoryCheck();
      gameController.switchPlayer();
    } else console.log("INVALID MOVE");
  };

  return {
    getBoard,
    setToken,
  };
})();

const displayController = (() => {
  const displayBoard = document.getElementById("board-container");
  const displayCells = document.querySelectorAll(".cell");
  for (const cell of displayCells) {
    cell.addEventListener("click", () => {
      const cellRow = cell.getAttribute("data-coords")[0];
      const cellCol = cell.getAttribute("data-coords")[1];
      gameBoard.setToken(cellRow, cellCol);
    });
  }
  const displayMessage = document.getElementById("message-container");

  const updateBoard = () => {
    const board = gameBoard.getBoard();

    for (let i = 0; i < displayCells.length; i++) {
      const cell = displayCells[i];
      const cellRow = cell.getAttribute("data-coords")[0];
      const cellCol = cell.getAttribute("data-coords")[1];

      if (board[cellRow][cellCol] === 1) {
        cell.style.color = "blue";
        cell.innerHTML = "X";
      } else if (board[cellRow][cellCol] === 2) {
        cell.style.color = "red";
        cell.innerHTML = "O";
      }
    }
  };

  const updateMessage = (msg, color) => {
    displayMessage.innerHTML = msg;
    displayMessage.style.color = color;
  };

  return { updateBoard, updateMessage };
})();
