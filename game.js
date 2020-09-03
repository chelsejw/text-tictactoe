const prompt = require('prompt-sync')()

const getSquarePosition = (squareNum, boardSize) => {
  let row = Math.ceil(squareNum / boardSize) - 1;
  let firstNumOfRow = boardSize * row + 1;
  let col = squareNum - firstNumOfRow;
  return {
    row,
    col,
  };
};

const getValueAtSquare = (squareNum, boardSize, gameBoard) => {
  let pos = getSquarePosition(squareNum, boardSize);
  //First num of row would be at col 0
  return gameBoard[pos.row][pos.col]
};

const markSquare = (squareNum, boardSize, gameBoard, marker) => {
    const {row, col} = getSquarePosition(squareNum, boardSize)

    if (!gameBoard[row][col]) {
        gameBoard[row][col] = marker
    } else {
        return false //If it has already been marked
    }
    return true
}

const displayBoard = (gameBoard, boardSize) => {
  let row = "";
  for (let i = 1; i <= boardSize * boardSize; i++) {
    let marker = getValueAtSquare(i, boardSize, gameBoard)
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


// GLOBAL VARiABLES: player1, player2, boardSize, gameBoard, turnNum, gameIsDone
const player1 = "Chelsea";
const player2 = "Misty";

let boardSize = prompt(
  "Enter board size as an integer greater than or equal to 3."
);

while (isNaN(boardSize) || boardSize < 3) {
  boardSize = prompt(
    "Invalid board size. Enter board size as an integer greater than or equal to 3."
  );
}

const gameBoard = initialiseGameBoard(boardSize)
displayBoard(gameBoard, boardSize);

let turnNum = 0
let gameIsDone = false

const makeMove = (turnNum) => {

    console.log(`Turn num is ${turnNum}`)
    // If turn number is even, it is player 1. else, it's player 2
    const currentPlayer = turnNum%2===0 ? player1 : player2
    const marker = currentPlayer==player1 ? "X" : "O"
    console.log(`It is ${currentPlayer}'s turn!`)
    let targetSquare = prompt(
      ` Please enter a number for where you want to make your move.`
    );

    let madeAValidMove = markSquare(targetSquare, boardSize, gameBoard, marker)
    while (!madeAValidMove) {
      targetSquare = prompt(
        "Sorry, that was an invalid move. Please enter a number for a square that has not already been marked."
      );
      madeAValidMove = markSquare(targetSquare, boardSize, gameBoard, marker);
    }
    displayBoard(gameBoard, boardSize)
    turnNum++;
    if (turnNum === boardSize * boardSize) {
        gameIsDone = true;
    }

    if (gameIsDone) {
        return console.log("Game is over!")
    }

    return makeMove(turnNum)
}

makeMove(turnNum)