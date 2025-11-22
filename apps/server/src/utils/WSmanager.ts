import WebSocket from "ws";
import ClientState from "./ClientState";
import { WSRequestType } from "./types";

class WSmanager {
  ws: WebSocket;
  clientState: ClientState;

  constructor(ws: WebSocket, clientState: ClientState) {
    this.ws = ws;
    this.clientState = clientState;
  }

  fetch(path: string = "/") {
    const { files, isChild } = this.clientState.fetchFiles(path);
    files.then((curFiles) => {
      this.ws.send(
        JSON.stringify({
          reqType: WSRequestType.FETCH,
          path: this.clientState.currentPath,
          isChild,
          files: curFiles,
        })
      );
    });
  }
}

export default WSmanager;
