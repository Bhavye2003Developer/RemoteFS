import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import WebSocket from "ws";
import ClientState from "./utils/ClientState";
import { WSRequest, WSRequestType } from "./utils/types";
import WSmanager from "./utils/WSmanager";

const app: Express = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

const wss = new WebSocket.Server({ server });

wss.on("connection", async (ws, req) => {
  console.log("Client connected");
  const ip = req.socket.remoteAddress;
  const clientState = new ClientState(ip);
  const wsManager = new WSmanager(ws, clientState);

  ws.on("message", async (message) => {
    const request: WSRequest = JSON.parse(message as unknown as string);

    if (request.type === WSRequestType.FETCH) {
      const childDir = request.data.dir || "";
      wsManager.fetch(childDir);
    } else if (request.type === WSRequestType.DELETE) {
      const file = request.data.file || null;
      const status = await clientState.removeFile(file);
      if (status === 1 && file) {
        console.log("File/ Folder successfully deleted.", file.name);
        wsManager.fetch();
      }
    } else if (request.type === WSRequestType.ADD) {
      const itemToAdd = request.data.itemToBeAdded || null;
      if (itemToAdd) {
        const status = await clientState.addItem(itemToAdd);
        if (status === 1) {
          console.log("File/ Folder created successfully", itemToAdd.name);
          wsManager.fetch();
        }
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
