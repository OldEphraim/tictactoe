export type Player = "x" | "o";
export type Cell = Player | "";
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
export type Wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const Wins: Wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const initialGameState = ["", "", "", "", "", "", "", "", ""] as Board;
export const initialPlayer = "x" as Player;

export function changePlayer(player: Player): Player {
  if (player === "x") {
    return "o";
  }
  return "x";
}

export function checkWin(board: Board, player: Player): Player | undefined {
  for (let i = 0; i < Wins.length; i++) {
    let winCon: number = 0;
    for (let j = 0; j < Wins[i].length; j++) {
      if (board[Wins[i][j]] === player) {
        winCon++;
      }
      if (winCon === 3) {
        return player;
      }
    }
  }
  return undefined;
}

export function move(
  position: number,
  prevGame: Board,
  player: Player,
): { newGame: Board; newPlayer: Player } | string {
  const newGame: Board = [...prevGame];

  // check if the move is valid at all
  if (prevGame[position] !== "") {
    return "You done messed up, A-A-Ron!";
  }

  // update the board state
  else {
    newGame[position] = player;
  }

  // check if anybody has won
  const winOutcome: Player | undefined = checkWin(newGame, player);
  if (winOutcome !== undefined) {
    return `${winOutcome} has won the game!`;
  }

  // check if the game is a tie
  if (!newGame.includes("")) {
    return "Tie game. Try being dumber next time.";
  }

  // otherwise, go to the next move
  const newPlayer: Player = changePlayer(player);
  return { newGame: newGame, newPlayer: newPlayer };
}
