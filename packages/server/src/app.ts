import express, { Express } from "express";
import { createServer } from "http";
import WebSocket from "ws";
import ClientState from "./utils/ClientState";
import { FILETYPE, LocFile, WSRequest, WSRequestType } from "./utils/types";
import WSmanager from "./utils/WSmanager";
import cors from "cors";
import path from "path";
import { generateArchive } from "./utils/helper";
import { createReadStream } from "fs";

const app: Express = express();
app.use(cors());
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

app.get("/download", (req, res) => {
  const fileInfoQuery = req.query["fileInfo"] as string;
  const fileInfo: LocFile = JSON.parse(fileInfoQuery);
  console.log(fileInfo);

  res.setHeader("Content-Type", "application/octet-stream");

  const fileToSend = path.join(fileInfo.path, fileInfo.name);

  if (fileInfo.type === FILETYPE.DIR) {
    generateArchive(fileInfo).then((zipname) => {
      console.log("ZIP READY: ", zipname);
      const fileStream = createReadStream(zipname as string);

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileInfo.name}.zip`
      );

      fileStream.pipe(res);
    });
  } else {
    const fileStream = createReadStream(fileToSend);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileInfo.name}`
    );

    fileStream.pipe(res);
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
