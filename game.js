const prompt = require('prompt-sync')({sigint: true}) 

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
  let {row, col} = getSquarePosition(squareNum, boardSize);
  //First num of row would be at col 0
  return gameBoard[row][col]
};

const markSquare = (squareNum, boardSize, gameBoard, marker) => {

    if (squareNum<=0 || squareNum > boardSize*boardSize) return false

    const {row, col} = getSquarePosition(squareNum, boardSize)
    if (gameBoard[row][col]===null) {
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
let thereIsWinner = false

// O(1) time complexity
const checkWin = (num) => {
  const { col, row } = getSquarePosition(num, boardSize);
  const latestSquare = gameBoard[row][col];
  //Horizontal:
  // If col-2 >= 0 then need to check for front 2
  // If col+2 < boardSize then check for back 2.
  if (col - 1 >= 0 && col + 1 < boardSize) {
    //If square has at least one space to the left and right
    if (gameBoard[row][col - 1] === latestSquare && latestSquare === gameBoard[row][col + 1])
      return true;
  }

  if (col - 2 >= 0) {
    //If the square has at least two spaces to the left
    if (
      gameBoard[row][col - 2] === latestSquare &&
      gameBoard[row][col - 1] === latestSquare
    ) {
      return true;
    }
  }
  if (col + 2 < boardSize) {
    //If the square has at least two spaces to the right
    if (latestSquare === gameBoard[row][col + 1] && latestSquare === gameBoard[row][col + 2])
      return true;
  }
  //VERTICAL:
  if (row - 1 >= 0 && row + 1 < boardSize) {
    if (gameBoard[row - 1][col] === latestSquare && latestSquare === gameBoard[row + 1][col])
      return true;
  }
  if (row - 2 >= 0) {
    if (gameBoard[row - 2][col] === latestSquare && gameBoard[row - 1][col] === latestSquare)
      return true;
  }
  if (row + 2 < boardSize) {
    if (latestSquare === gameBoard[row + 1][col] && latestSquare === gameBoard[row + 2][col])
      return true;
  }
  // DIAGONAL:
  if (row - 2 >= 0 && col + 2 < boardSize) {
    //If there are two squares diagonally upper right
    if (
      latestSquare === gameBoard[row - 1][col + 1] && latestSquare ===
      gameBoard[row - 2][col + 2]
    )
      return true;
  }
  if (row + 2 < boardSize && col - 2 >= 0) {
    // If there are two squares diagonally lower left
    if (
      latestSquare === gameBoard[row + 1][col - 1] && latestSquare ===
      gameBoard[row + 2][col - 2]
    )
      return true;
  }
  if (
    row + 1 < boardSize &&
    row - 1 >= 0 &&
    col + 1 < boardSize &&
    col - 1 >= 0
  ) {
    //If there is one space diagonally lower left and upperright
    if (
      gameBoard[row + 1][col - 1] === latestSquare && latestSquare ===
      gameBoard[row - 1][col + 1]
    )
      return true;
  }
  if (row - 2 >= 0 && col - 2 >= 0) {
    //If there are two squares diagonally upper left
    if (
      gameBoard[row - 2][col - 2] === latestSquare && gameBoard[row - 1][col - 1] ===
      latestSquare
    )
      return true;
  }
  if (row + 2 < boardSize && col + 2 < boardSize) {
    //If there are two squares diagonally lower right
    if (
      latestSquare === gameBoard[row + 1][col + 1] && latestSquare ===
      gameBoard[row + 2][col + 2]
    )
      return true;
  }
  if (
    row - 1 >= 0 &&
    col - 1 >= 0 &&
    row + 1 < boardSize &&
    col + 1 < boardSize
  ) {
    if (
      gameBoard[row - 1][col - 1] === latestSquare && latestSquare === 
      gameBoard[row + 1][col + 1]
    )
      return true;
  }
  return false;
};
const makeMove = (turnNum) => {

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

    if (turnNum >4 && checkWin(targetSquare)) { //Because there can only be a winner on the fifth move.
        gameIsDone = true
        thereIsWinner = true
    }

    if (turnNum === boardSize * boardSize) {
        gameIsDone = true;
    }

    if (gameIsDone && !thereIsWinner) {
        return console.log("Game is over! There was no winner.")
    } else if (gameIsDone && thereIsWinner) {
        return console.log(`Game is over! ${currentPlayer} won!`)
    }

    return makeMove(turnNum)
}

makeMove(turnNum)
