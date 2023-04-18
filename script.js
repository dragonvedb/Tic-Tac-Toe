const Player = (name, color) => {
  const getName = () => name;
  const getColor = () => color;

  return { getName, getColor };
};

let playerOne = null;
let playerTwo = null;

const form = document.getElementById("players-form");
const colorPickers = document.querySelectorAll('input[type="radio"]');
for (let i = 0; i < colorPickers.length; i++) {
  const picker = colorPickers[i];
  picker.style.backgroundColor = picker.value;
}
form.onsubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  playerOne = Player(formData.get("p1-name"), formData.get("p1-color"));
  playerTwo = Player(formData.get("p2-name"), formData.get("p2-color"));
  form.classList.toggle("hidden");
  displayController.toggleGame();
};

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
    displayController.updateMessage(
      `${winner.getName()} has won on turn ${turnCounter}. Congratulations!`,
      winner.getColor()
    );
    displayController.toggleBoard();
    displayController.toggleResetBtn();
  };

  const declareTie = () => {
    displayController.updateMessage("The game is tied.", "white");
    displayController.toggleBoard();
    displayController.toggleResetBtn();
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
    if (turnCounter >= 9) return declareTie();
    return switchPlayer();
  };

  const reset = () => {
    turnCounter = 1;
    currentPlayer = playerOne;
    gameBoard.clearBoard();
    displayController.reset();
  };

  return {
    getCurrentTurn,
    getCurrentPlayer,
    switchPlayer,
    victoryCheck,
    reset,
  };
})();

const gameBoard = (() => {
  let board = [];

  const clearBoard = () => {
    board = [];
    for (let i = 0; i < 3; i++) {
      board.push([]);
      for (let x = 0; x < 3; x++) {
        board[i].push(0);
      }
    }
  };

  const getBoard = () => board;

  const setToken = (cellRow, cellCol) => {
    const player = gameController.getCurrentPlayer();

    if (board[cellRow][cellCol] === 0) {
      board[cellRow][cellCol] = player === playerOne ? 1 : 2;
      displayController.updateBoard();
      if (gameController.getCurrentTurn() >= 5) {
        gameController.victoryCheck();
      } else gameController.switchPlayer();
    }
  };

  clearBoard();

  return {
    clearBoard,
    getBoard,
    setToken,
  };
})();

const displayController = (() => {
  const displayGame = document.getElementById("game-container");
  const toggleGame = () => displayGame.classList.toggle("hidden");

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

  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", () => {
    gameController.reset();
    toggleResetBtn();
  });
  const toggleResetBtn = () => {
    resetButton.classList.toggle("hidden");
  };

  const updateBoard = () => {
    const board = gameBoard.getBoard();

    for (let i = 0; i < displayCells.length; i++) {
      const cell = displayCells[i];
      const cellRow = cell.getAttribute("data-coords")[0];
      const cellCol = cell.getAttribute("data-coords")[1];

      if (board[cellRow][cellCol] === 1) {
        cell.style.color = playerOne.getColor();
        cell.innerHTML = "X";
        cell.classList.add("marked");
      } else if (board[cellRow][cellCol] === 2) {
        cell.style.color = playerTwo.getColor();
        cell.innerHTML = "O";
        cell.classList.add("marked");
      } else {
        cell.innerHTML = "";
        cell.classList.remove("marked");
      }
    }
  };

  const updateMessage = (msg, color) => {
    displayMessage.innerHTML = msg;
    displayMessage.style.color = color;
  };

  const toggleBoard = () => displayBoard.classList.toggle("disabled");

  const reset = () => {
    updateBoard();
    updateMessage(
      `${playerOne.getName()}, make your move.`,
      playerOne.getColor()
    );
    displayBoard.classList.toggle("disabled");
  };

  return {
    toggleGame,
    toggleResetBtn,
    updateBoard,
    updateMessage,
    toggleBoard,
    reset,
  };
})();
