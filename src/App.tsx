import {
  initialGameState,
  initialPlayer,
  Board,
  Player,
  Cell,
  move,
} from "../game-logic/tictactoe";
import { useState } from "react";
import "./App.css";

function App() {
  const [gameInterrupted, setGameInterrupted] = useState([false, ""]);
  const [gameState, setGameState] = useState(initialGameState);
  const [player, setPlayer] = useState(initialPlayer);

  function handleClick(index: number, gameState: Board, player: Player) {
    const moveOutcome: string | { newGame: Board; newPlayer: Player } = move(
      index,
      gameState,
      player,
    );
    if (typeof moveOutcome === "string") {
      return setGameInterrupted([true, moveOutcome]);
    } else {
      setGameState(moveOutcome.newGame);
      setPlayer(moveOutcome.newPlayer);
    }
  }

  function resetGame() {
    setGameInterrupted([false, ""]);
    setGameState(initialGameState);
    setPlayer(initialPlayer);
  }

  return gameInterrupted[0] ? (
    <>
      <div>{gameInterrupted[1]}</div>
      <div className="flex text-sm">
        <button onClick={() => resetGame()}>Play Again</button>
        <button>Brag About It</button>
      </div>
    </>
  ) : (
    <div className="grid grid-cols-3 gap-2 w-[300px]">
      {gameState.map((cell: Cell, index: number) => (
        <button
          key={index}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold flex items-center justify-center aspect-square text-2xl rounded cursor-pointer px-4 py-4"
          onClick={() => handleClick(index, gameState, player)}
        >
          {cell}
        </button>
      ))}
    </div>
  );
}

export default App;
