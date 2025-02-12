const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const WS_BASE_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3001";

export const apiClient = treaty<ApiApp>(API_BASE_URL);
export const socket = new WebSocket(WS_BASE_URL);