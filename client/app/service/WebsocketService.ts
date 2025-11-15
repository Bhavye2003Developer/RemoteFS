import { useWebSocketStore } from "~/store/useWebsocketStore";

class WebsocketService {
  socketURL: string;
  socket: WebSocket | null;

  constructor() {
    this.socketURL = `ws://localhost:3000`;
    this.socket = null;
  }

  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

    console.log("Connecting...");

    this.socket = new WebSocket(this.socketURL);
    console.log(this.socket);

    this.socket.onopen = () => {
      useWebSocketStore.getState().setConnectionStatus("connected");
    };

    this.socket.onmessage = (message) => {
      useWebSocketStore.getState().updateMessage(message.data);
    };

    this.socket.onclose = () => {
      useWebSocketStore.getState().setConnectionStatus("disconnected");
    };
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN)
      this.socket.send(message);
    else console.error("WebSocket is not connected");
  }

  disconnect() {
    this.socket?.close();
    useWebSocketStore.getState().setConnectionStatus("disconnected");
  }
}

export default WebsocketService;
