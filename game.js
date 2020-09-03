const prompt = require('prompt-sync')()

const getValueAtIndex = (num, boardSize, gameBoard) => {
  let row = Math.ceil(num / boardSize) - 1;
  let firstNumOfRow = boardSize * row + 1;
  let col = num - firstNumOfRow;
  //First num of row would be at col 0
  return gameBoard[row][col]
};

const displayBoard = (gameBoard, boardSize) => {
  let row = "";
  for (let i = 1; i <= boardSize * boardSize; i++) {
    let marker = getValueAtIndex(i, boardSize, gameBoard)
    //If the value is null, then use the index instead
    if (!marker) marker = i

    let extraSpace = boardSize - marker.toString().length;

    row += `${"\xa0".repeat(
      Math.floor(extraSpace / 2)
    )}${marker}${"\xa0".repeat(Math.ceil(extraSpace / 2))}${
      i % boardSize !== 0 ? "|" : ""
    }`;
    if (i % boardSize === 0) {
      //If this is the last square of the row,
      console.log(row);
      const rowLength = row.length;
      row = "";
      console.log("=".repeat(rowLength));
    }
  }
};

const initialiseGameBoard = (boardSize) => {
    boardSize = parseInt(boardSize);
    let gameBoard = [];
    for (let i = 0; i < boardSize; i++) {
        let newRow = new Array(boardSize).fill(null);
        gameBoard.push(newRow);
    }
    return gameBoard
}


// const player1 = prompt("Enter Player 1 Name: ")
// const player2 = prompt("Enter Player 2 Name: ");


// GLOBAL VARiABLES: player1, player2, boardSize, gameBoard, turnNum
const player1 = "Chelsea";
const player2 = "Misty";

let boardSize = prompt(
  "Enter board size as an integer greater than or equal to 3."
);

while (isNaN(boardSize)) {
  boardSize = prompt(
    "Invalid board size. Enter board size as an integer greater than or equal to 3."
  );
}

const gameBoard = initialiseGameBoard(boardSize)
displayBoard(gameBoard, boardSize);

const turnNum = 0

const makeMove = (turnNum) => {
    // If turn number is even, it is player 1. else, it's player 2
    const currentPlayer = turnNum%2===0 ? player1 : player2
    const marker = currentPlayer==player1 ? "X" : "O"
    console.log(`It is ${currentPlayer}'s turn!`)
    const targetIndex = prompt(
      ` Please enter a number for where you want to make your move.`
    );

    //Get the current value
    let valueAtIndex = getValueAtIndex(targetIndex);

    

    turnNum++;
    return displayBoard(gameBoard, boardSize)
}
