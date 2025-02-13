import { Cell, GameState, initialGameState } from "../game-logic/tictactoe";
import { ConnectionId } from "../game-logic/lobbies";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001"
    : import.meta.env.VITE_BACKEND_URL ||
      "https://tic-tac-toe-crimson-violet-9233.fly.dev";

const socket: Socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
});

const clientId: ConnectionId = uuidv4();

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    socket.on("gameUpdate", (gameState) => {
      setGameState(gameState);

      if (gameState.Interruption) {
        setIsModalOpen(true);
      }
    });

    return () => {
      socket.off("gameUpdate");
    };
  }, []);

  function startNewGame(size: number, connectionId: ConnectionId) {
    socket.emit("startGame", size, connectionId);
  }

  function joinExistingGame(size: number, connectionId: ConnectionId) {
    socket.emit("joinGame", size, connectionId);
  }

  function playSelf(size: number, connectionId: ConnectionId) {
    socket.emit("playSelf", size, connectionId);
  }

  function playComputer(size: number, connectionId: ConnectionId) {
    socket.emit("playComputer", size, connectionId);
  }

  function handleClick(index: number, connectionId: ConnectionId) {
    if (!isModalOpen) {
      socket.emit("playerMove", index, connectionId);
    }
  }

  function closeModal(connectionId: ConnectionId) {
    if (isModalOpen) {
      setIsModalOpen(false);
      socket.emit("closeModal", connectionId);
    }
  }

  function resetGame() {
    socket.emit("resetGame");
    setIsModalOpen(false);
  }

  return (
    <>
      {/* TITLE */}
      <div className="min-h-screen flex flex-col items-center">
        <div className="text-[50px] font-bold text-center bg-gray-100 shadow-md">
          Tic-Tac-Toe Game
        </div>
        <div className="text-[25px] font-bold text-center bg-gray-100 shadow-md">
          Grid Size: {gameState.Size}
          {/* GAME SETTINGS */}
          {!gameState.Start && (
            <div>
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                  onClick={() =>
                    setGameState({ ...gameState, Size: gameState.Size + 1 })
                  }
                >
                  Increment Grid Size
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                  onClick={() => {
                    if (gameState.Size > 0) {
                      setGameState({ ...gameState, Size: gameState.Size - 1 });
                    }
                  }}
                >
                  Decrement Grid Size
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                  onClick={() => startNewGame(gameState.Size, clientId)}
                >
                  Create New Game (against Human!)
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                  onClick={() => joinExistingGame(gameState.Size, clientId)}
                >
                  Join Existing Game (against Human!)
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                  onClick={() => playSelf(gameState.Size, clientId)}
                >
                  Play Against Yourself
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-[15px] text-white font-bold flex items-center justify-center rounded cursor-pointer"
                  onClick={() => playComputer(gameState.Size, clientId)}
                >
                  Play Against Computer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="h-screen flex items-center justify-center inset-0 bg-gray-900 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl border-4 border-blue-500 text-center w-96">
              <h2 className="text-2xl font-bold text-gray-800">
                {gameState.InterruptionMessage}
              </h2>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => closeModal(clientId)}
                >
                  Back to Game
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => resetGame()}
                >
                  Quit In Disgust
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GAME BOARD AND END SCREEN */}
        {gameState.Start && (
          <div className="flex-1 flex justify-center items-center mt-[60px] z-0">
            {/* {gameState.Interruption ? (
              <>
                <div className="text-center">
                  <div className="text-[50px] mb-4">
                    {gameState.InterruptionMessage}
                  </div>
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
            ) : ( */}
            <div
              className={`grid gap-2 w-[300px]`}
              style={{
                gridTemplateColumns: `repeat(${gameState.Size}, minmax(0, 1fr))`,
              }}
            >
              {gameState.Board.map((cell: Cell, index: number) => (
                <button
                  key={index}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold flex items-center justify-center aspect-square text-2xl rounded cursor-pointer px-4 py-4"
                  onClick={() => handleClick(index, clientId)}
                >
                  {cell}
                </button>
              ))}
            </div>
            {/* )} */}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
