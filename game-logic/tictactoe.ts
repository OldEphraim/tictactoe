export type Player = "x" | "o";
export type Cell = Player | "";
export type Board = Cell[];
export type Wins = number[][];

export const initialPlayer = "x" as Player;

export function calculateWins(size: number): Wins {
  const horizontalWins: Wins = [];
  for (let i = 0; i < size; i++) {
    horizontalWins[i] = [];
    for (let j = 0; j < size; j++) {
      horizontalWins[i][j] = i * size + j;
    }
  }
  const verticalWins: Wins = [];
  for (let k = 0; k < size; k++) {
    verticalWins[k] = [];
    for (let l = 0; l < size; l++) {
      verticalWins[k][l] = k + size * l;
    }
  }
  const diagonalWins: Wins = [[], []];
  for (let m = 0; m < size; m++) {
    diagonalWins[0][m] = m + size * m;
    diagonalWins[1][m] = size - 1 + (size - 1) * m;
  }
  const Wins: Wins = [...horizontalWins, ...verticalWins, ...diagonalWins];
  return Wins;
}

export function initialGameState(size: number): Board {
  return new Array(size * size).fill("") as Board;
}

export function changePlayer(player: Player): Player {
  if (player === "x") {
    return "o";
  }
  return "x";
}

export function checkWin(
  board: Board,
  player: Player,
  wins: Wins,
): Player | undefined {
  for (let i = 0; i < wins.length; i++) {
    let winCon: number = 0;
    for (let j = 0; j < wins[i].length; j++) {
      if (board[wins[i][j]] === player) {
        winCon++;
      }
      if (winCon === (wins.length - 2) / 2) {
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
  wins: Wins,
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
  const winOutcome: Player | undefined = checkWin(newGame, player, wins);
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
