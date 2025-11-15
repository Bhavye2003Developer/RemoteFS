import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import WebSocket from "ws";
import ClientState from "./utils/ClientState";
import { WSRequest, WSRequestType } from "./utils/types";

const app: Express = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

const wss = new WebSocket.Server({ server });

wss.on("connection", async (ws, req) => {
  console.log("Client connected");
  const ip = req.socket.remoteAddress;
  const clientState = new ClientState(ip);

  ws.on("message", async (message) => {
    const request: WSRequest = JSON.parse(message as unknown as string);

    // console.log("req: ", request);

    if (request.type === WSRequestType.FETCH) {
      const childDir = request.data.dir || "";

      const { files, isChild } = clientState.fetchFiles(childDir);

      console.log("IS PATH CHILD: ", isChild);

      files.then((curFiles) => {
        ws.send(
          JSON.stringify({
            reqType: WSRequestType.FETCH,
            path: clientState.currentPath,
            isChild,
            files: curFiles,
          })
        );
      });
    } else if (request.type === WSRequestType.DELETE) {
      const file = request.data.file || null;
      const status = await clientState.removeFile(file);
      if (status === 1 && file) {
        console.log("File/ Folder successfully deleted.", file.name);
        const { files, isChild } = clientState.fetchFiles("/");
        console.log("IS PATH CHILD: ", isChild);
        files.then((curFiles) => {
          ws.send(
            JSON.stringify({
              reqType: WSRequestType.FETCH,
              path: clientState.currentPath,
              isChild,
              files: curFiles,
            })
          );
        });
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
