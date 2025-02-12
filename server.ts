import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { initialGameState, move, startTheGame } from "./game-logic/tictactoe";
import { initialLobbyState, isCurrentPlayer, playerJoin } from "./game-logic/lobbies";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello, world");
});

const httpServer = createServer(app);
const PORT = 3001;

let lobby = initialLobbyState;

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("playerMove", (position: number, connectionId: string) => {
    if (isCurrentPlayer(connectionId, lobby)) {
        lobby.gameState = move(position, lobby.gameState);
        io.emit("gameUpdate", lobby.gameState);
    } else {
        console.log("It is not your turn!");
    }
  });

  socket.on("startGame", (size: number, connectionId: string) => {
    lobby.gameState = startTheGame(size);
    lobby = playerJoin(connectionId, lobby);
    console.log(lobby);
    io.emit("gameUpdate", lobby.gameState);
  });

  socket.on("resetGame", () => {
    lobby.gameState = initialGameState;
    io.emit("gameUpdate", lobby.gameState);
  });

  socket.on("disconnect", () => {
    console.log("Player Disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(
    `Backend is running on Express server on http://localhost:${PORT}`,
  );
});
