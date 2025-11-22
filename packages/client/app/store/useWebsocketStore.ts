import { create } from "zustand";

const socketURL = `ws://localhost:3000`;

interface WebsocketStore {
  socket: null | WebSocket;
  isConnected: boolean;
  message: string;
  connect: () => void;
  sendMessage: (message: any) => void;
  disconnect: () => void;
}

const useWebsocketStore = create<WebsocketStore>()((set, get) => ({
  socket: null,
  isConnected: false,
  message: "{}",
  connect() {
    const curSocket = get().socket;
    if (!curSocket || curSocket.readyState !== WebSocket.OPEN) {
      const socket = new WebSocket(socketURL);

      socket.onopen = () => {
        set((state) => ({ ...state, socket, isConnected: true }));
      };

      socket.onmessage = (message) => {
        set((state) => ({ ...state, message: message.data }));
      };

      socket.onclose = () => {
        set((state) => ({ ...state, socket: null, isConnected: false }));
      };
    }
  },
  sendMessage(message) {
    const messageToBeSend = JSON.stringify(message);
    get().socket?.send(messageToBeSend);
  },

  disconnect() {
    const { socket } = get();
    if (socket) socket.close();
  },
}));

export default useWebsocketStore;
