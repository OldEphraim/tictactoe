import { GameState, initialGameState, Player } from "./tictactoe";

export type ConnectionId = string;

export type Lobby = {
  gameState: GameState;
  gameId: number;
  players: Map<Player, ConnectionId>;
};

export const initialLobbyState = {
  gameState: initialGameState,
  gameId: 2,
  players: new Map(),
} as Lobby;

export function isCurrentPlayer(
  connectionId: ConnectionId,
  lobby: Lobby,
): boolean {
  return connectionId === lobby.players[lobby.gameState.Player];
}

export function playerJoin(
  connectionId: ConnectionId,
  lobbyState: Lobby,
): Lobby {
  const newLobby: Lobby = { ...lobbyState };

  if (!newLobby.players["x"]) {
    newLobby.players["x"] = connectionId;
  } else if (!newLobby.players["o"]) {
    newLobby.players["o"] = connectionId;
  } else {
    console.log(
      "Either add the ability to join as a spectator or log an error; for now, we won't update lobby state.",
    );
  }

  return newLobby;
}
