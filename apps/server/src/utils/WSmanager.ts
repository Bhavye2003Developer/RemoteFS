import WebSocket from "ws";
import ClientState from "./ClientState";
import { WSRequestType } from "@remotely/utils/types";
import { FSWatcher, watch } from "chokidar";

class WSmanager {
  ws: WebSocket;
  clientState: ClientState;
  watcher: null | FSWatcher = null;

  constructor(ws: WebSocket, clientState: ClientState) {
    this.ws = ws;
    this.clientState = clientState;
  }

  async fetch(message: string | null, path: string | null) {
    const { currentPath, files, isChild } =
      await this.clientState.fetchFiles(path);

    if (this.watcher) this.watcher.close();
    this.watcher = watch(currentPath, {
      depth: 0,
      ignoreInitial: true,
    }).on("all", () => {
      this.fetch("CurrentPath files updated.", null);
    });

    this.ws.send(
      JSON.stringify({
        reqType: WSRequestType.FETCH,
        path: this.clientState.currentPath,
        isChild,
        files,
        message,
      })
    );
  }
}

export default WSmanager;
