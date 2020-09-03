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

const markSquare = (squareNum, boardSize, gameBoard, marker) => {
    const {row, col} = getSquarePosition(squareNum, boardSize)
    if (gameBoard[row][col]===null) {
        gameBoard[row][col] = marker
    } else {
        return false //If it has already been marked
    }
    return true
}

const displayBoard = (gameBoard, boardSize) => {
  let rowString = "";
  for (let i = 1; i <= boardSize * boardSize; i++) {
    const {row, col} = getSquarePosition(i, boardSize)
    let marker = gameBoard[row][col]
    //If the value is null, then use the index instead
    if (!marker) marker = i

    let extraSpace = boardSize - marker.toString().length;

    // Concactenate the row string with the appropriate spaces and marker value
    rowString += `${"\xa0".repeat(
      Math.floor(extraSpace / 2)
    )}${marker}${"\xa0".repeat(Math.ceil(extraSpace / 2))}${
      i % boardSize !== 0 ? "|" : "" //If it's not the end of the row, add the | symbol
    }`;

    if (i % boardSize === 0) {
      //If this is the last square of the row, display the finished row
      console.log(rowString);
      console.log("-".repeat(rowString.length)); // Concactenate a string of dashed lines, number equal to the no. of characters in the row
      rowString = ""; // Clear current row string to make way for next row
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

// GLOBAL VARiABLES: player1, player2, boardSize, gameBoard, turnNum, gameIsDone
// GETTING PLAYER NAMES
const regex = /^([^-!@#$%^&*()\s]|\w|\d)/;
console.log("Enter Player 1 Name: ");
let player1 = prompt();

while (!regex.test(player1)) {
    console.log(
      "Player 1 name was invalid. (Should not be empty, and should start with a letter or number.) Please enter Player 1's Name: "
    );
    player1 = prompt()
}
console.log("Enter Player 2 Name: ");
let player2 = prompt();

while (!regex.test(player2) || player2==player1) {
    //If the regex check failed, prompt for valid name. Else player2 name was the same as player1, ask for new name.
    if (!regex.test(player2)) {
        console.log("Player 2 name was invalid. (Should not be empty, and should start with a letter or number.)  Please enter Player 2's Name: ")
    } else {
        console.log("Player 2 cannot have the same name as Player 1. Please enter a new name for Player 2: "); 
    }
    
    player2 = prompt()
}


console.log("Enter board size as an integer greater than or equal to 3: ");

let boardSize = prompt()

while (isNaN(boardSize) || boardSize < 3) {
    console.log("Invalid board size. Enter board size as an integer greater than or equal to 3.")
    boardSize = prompt();
}

// Make sure boardSize is an integer
boardSize = parseInt(boardSize)



const gameBoard = initialiseGameBoard(boardSize)
displayBoard(gameBoard, boardSize);
let turnNum = 0
let gameIsDone = false
let thereIsWinner = false

// O(1) time complexity, unaffected by board size
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
    if (gameBoard[row][col - 2] === latestSquare &&gameBoard[row][col - 1] === latestSquare) return true;

  }
  if (col + 2 < boardSize) {
    //If the square has at least two spaces to the right
    if (latestSquare === gameBoard[row][col + 1] && latestSquare === gameBoard[row][col + 2]) return true;
  }
  //VERTICAL:
  if (row - 1 >= 0 && row + 1 < boardSize) {
    if (gameBoard[row - 1][col] === latestSquare && latestSquare === gameBoard[row + 1][col]) return true;
  }

  if (row - 2 >= 0) {
    if (gameBoard[row - 2][col] === latestSquare && gameBoard[row - 1][col] === latestSquare) return true;
  }

  if (row + 2 < boardSize) {
    if (latestSquare === gameBoard[row + 1][col] && latestSquare === gameBoard[row + 2][col]) return true;
  }
  // DIAGONAL:
  if (row - 2 >= 0 && col + 2 < boardSize) {
    //If there are two squares diagonally upper right
    if (latestSquare === gameBoard[row - 1][col + 1] && latestSquare === gameBoard[row - 2][col + 2]) return true;
  }


  if (row + 2 < boardSize && col - 2 >= 0) {
    // If there are two squares diagonally lower left
    if (
      latestSquare === gameBoard[row + 1][col - 1] && latestSquare ===
      gameBoard[row + 2][col - 2]
    )
      return true;
  }
  if (row + 1 < boardSize && row - 1 >= 0 && col + 1 < boardSize && col - 1 >= 0) {
    //If there is one space diagonally lower left and upperright
    if (gameBoard[row + 1][col - 1] === latestSquare && latestSquare === gameBoard[row - 1][col + 1]) return true;
  }

  if (row - 2 >= 0 && col - 2 >= 0) {
    //If there are two squares diagonally upper left
    if (gameBoard[row - 2][col - 2] === latestSquare && gameBoard[row - 1][col - 1] === latestSquare)
      return true;
  }

  if (row + 2 < boardSize && col + 2 < boardSize) {
    //If there are two squares diagonally lower right
    if (latestSquare === gameBoard[row + 1][col + 1] && latestSquare === gameBoard[row + 2][col + 2]) return true;
  }


  if (row - 1 >= 0 && col - 1 >= 0 && row + 1 < boardSize && col + 1 < boardSize) {
    if (gameBoard[row - 1][col - 1] === latestSquare && latestSquare === gameBoard[row + 1][col + 1])
      return true;
  }
  //If none of the checks returned true, return false
  return false;
};

const makeMove = (turnNum) => {

    // If turn number is even, it is player 1. else, it's player 2
    const currentPlayer = turnNum%2===0 ? player1 : player2
    const marker = currentPlayer==player1 ? "X" : "O"
    console.log(`It is ${currentPlayer}'s turn!`)
    console.log(`Please enter a number for where you want to make your move:`);
    let targetSquare = prompt();
    while (isNaN(targetSquare) || targetSquare <= 0 || targetSquare > boardSize * boardSize) {
        if (isNaN(targetSquare)) {
            console.log(`Sorry, that was not a number. Please enter a number for where you want make your move: `)
        } else {
            console.log(`Sorry, there are no squares with that number. Please enter a number for where you want make your move: `)
        }
        targetSquare = prompt();
    }

    targetSquare = parseInt(targetSquare)

    let madeAValidMove = markSquare(targetSquare, boardSize, gameBoard, marker)
    while (!madeAValidMove) {
      console.log("Sorry, that was an invalid move. Please enter a number for a square that has not already been marked: ");
      targetSquare = prompt();
      madeAValidMove = markSquare(targetSquare, boardSize, gameBoard, marker);
    }

    displayBoard(gameBoard, boardSize)
    turnNum++;
    if (turnNum >4) {
      //Because there can only be a winner on the fifth move.
      if (checkWin(targetSquare)) {
        gameIsDone = true;
        thereIsWinner = true;
      }
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
