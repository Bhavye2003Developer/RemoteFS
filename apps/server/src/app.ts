import express, { Express } from "express";
import { createServer } from "http";
import WebSocket from "ws";
import ClientState from "./utils/ClientState";
import WSmanager from "./utils/WSmanager";
import cors from "cors";
import path from "path";
import { generateArchive, generatePasscodeHash } from "./utils/helper";
import { createReadStream } from "fs";
import multer from "multer";
import {
  FILETYPE,
  LocFile,
  WSRequest,
  WSRequestType,
} from "@remotely/utils/types";
import { SERVER_PORT, SYSTEM_IP } from "@remotely/utils/constants";

const app: Express = express();
app.use(cors());
const server = createServer(app);
const port = SERVER_PORT;
const host = "0.0.0.0";

const wss = new WebSocket.Server({ server });

const clientStates: ClientState[] = [];

app.get("/code", (req, res) => {
  const passcodeHash = generatePasscodeHash();
  res.json({
    code: passcodeHash,
  });
});

wss.on("connection", async (ws, req) => {
  console.log("Client connected");
  const ip = req.socket.remoteAddress;
  const clientState = new ClientState(ip);
  const wsManager = new WSmanager(ws, clientState);

  clientStates.push(clientState);

  ws.on("message", async (message) => {
    const request: WSRequest = JSON.parse(message as unknown as string);

    if (request.type === WSRequestType.FETCH) {
      const childDir = request.data.dir || null;
      wsManager.fetch(null, childDir);
    } else if (request.type === WSRequestType.DELETE) {
      const file = request.data.file || null;
      const status = await clientState.removeFile(file);
      if (status === 1 && file) {
        // console.log("File/ Folder successfully deleted.", file.name);
        wsManager.fetch("File/ Folder successfully deleted.", null);
      }
    } else if (request.type === WSRequestType.ADD) {
      const itemToAdd = request.data.itemToBeAdded || null;
      if (itemToAdd) {
        const status = await clientState.addItem(itemToAdd);
        if (status === 1) {
          // console.log("File/ Folder created successfully", itemToAdd.name);
          wsManager.fetch("File/ Folder created successfully", null);
        }
      }
    }
  });
});

app.get("/download", (req, res) => {
  const fileInfoQuery = req.query["fileInfo"] as string;
  const fileInfo: LocFile = JSON.parse(fileInfoQuery);

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

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const encodedPath = req.query.path;
    let path = __dirname;
    if (encodedPath) path = decodeURIComponent(encodedPath as string);
    callback(null, path);
  },
  filename(req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.array("ClientFiles", 10), (req, res) => {
  const files = req.files;
  if (!files) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).send("File uploaded successfully...");
});

server.listen(port, host, () => {
  console.log(`Server running on http://${SYSTEM_IP}:${port}`);
});
