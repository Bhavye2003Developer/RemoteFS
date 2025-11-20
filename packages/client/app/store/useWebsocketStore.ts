import { create } from "zustand";

interface WebsocketStore {
  connectionStatus: string;
  message: string;

  setConnectionStatus: (status: string) => void;
  updateMessage: (message: string) => void;
}

export const useWebSocketStore = create<WebsocketStore>()((set) => ({
  connectionStatus: "disconnected",
  message: "{}",
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  updateMessage: (message) => set((state) => ({ ...state, message })),
}));
