# About
Text-based tictactoe for Zendesk take-home assignment. Program can generate boards of any size. Player wins as long as they have 3 consecutive markers in a row (horizontally, diagonally, vertically) regardless of board size. 


# Requirements
- node.js
- prompt-sync to get user inputs within terminal

# Instructions
- Run `npm i` to get packages
- Enter `node game.js` into your terminal and follow the instructions!

# Notes
Focus was to make a win check that had O(1) time complexity since there is a dynamic board size. Did so by only checking the squares around the latest move. (Max of 12 patterns checked) 
