import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { initialGameState, move, startNewGame } from "./game-logic/tictactoe";
import {
  initialLobbyState,
  isCurrentPlayer,
  createNewLobby,
  joinExistingLobby,
} from "./game-logic/lobbies";

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
      console.log("It is not your turn, ", lobby.gameState.Player);
    }
  });

  socket.on("startGame", (size: number, connectionId: string) => {
    lobby.lobbyId = uuidv4();
    lobby.gameState = startNewGame(size);
    lobby = createNewLobby(connectionId, lobby);
    console.log("lobby in socket.on startGame function:", lobby);
    io.emit("gameUpdate", lobby.gameState);
  });

  socket.on("joinGame", (size: number, connectionId: string) => {
    lobby = joinExistingLobby(size, connectionId);
    console.log("lobby in socket.on joinGame function:", lobby);
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
