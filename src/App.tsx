import {
  Board,
  Player,
  Cell,
  move,
  calculateWins,
  initialGameState,
} from "../game-logic/tictactoe";
import { useState } from "react";
import "./App.css";

function App() {
  const [gameInterrupted, setGameInterrupted] = useState([false, ""]);
  const [gameState, setGameState] = useState([""] as Board);
  const [gameStart, setGameStart] = useState(false);
  const [gridSize, setGridSize] = useState(0);
  const [player, setPlayer] = useState("x" as Player);

  function startTheGame(size: number) {
    setGameState(initialGameState(size));
    setGameStart(true);
  }

  function handleClick(index: number, gameState: Board, player: Player) {
    const moveOutcome: string | { newGame: Board; newPlayer: Player } = move(
      index,
      gameState,
      player,
      calculateWins(gridSize),
    );
    if (typeof moveOutcome === "string") {
      setGameInterrupted([true, moveOutcome]);
    } else {
      setGameState(moveOutcome.newGame);
      setPlayer(moveOutcome.newPlayer);
    }
  }

  function resetGame() {
    setGameInterrupted([false, ""]);
    setGameState([""] as Board);
    setGameStart(false);
    setGridSize(0);
    setPlayer("x" as Player);
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center">
        <div className="text-[50px] font-bold text-center bg-gray-100 shadow-md">
          Tic-Tac-Toe Game
        </div>
        <div className="text-[25px] font-bold text-center bg-gray-100 shadow-md">
          Grid Size: {gridSize}
          {!gameStart && (
            <div className="flex">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                onClick={() => setGridSize(gridSize + 1)}
              >
                Increment Grid Size
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                onClick={() => setGridSize(gridSize - 1)}
              >
                Decrement Grid Size
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                onClick={() => startTheGame(gridSize)}
              >
                Start the Game
              </button>
            </div>
          )}
        </div>
        {gameStart && (
          <div className="flex-1 flex justify-center items-center mt-[60px]">
            {gameInterrupted[0] ? (
              <>
                <div className="text-center">
                  <div className="text-[50px] mb-4">{gameInterrupted[1]}</div>
                  <div className="flex gap-4 justify-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => resetGame()}
                    >
                      Play Again
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                      Brag About It
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div
                className={`grid gap-2 w-[300px]`}
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
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
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
