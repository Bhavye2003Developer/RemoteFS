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
import multer from "multer";

const app: Express = express();
app.use(cors());
const server = createServer(app);
const port = process.env.PORT || 3000;

const wss = new WebSocket.Server({ server });

const clientStates: ClientState[] = [];

wss.on("connection", async (ws, req) => {
  console.log("Client connected");
  const ip = req.socket.remoteAddress;
  const clientState = new ClientState(ip);
  const wsManager = new WSmanager(ws, clientState);

  clientStates.push(clientState);

  ws.on("message", async (message) => {
    console.log("GOT MESSAGE: ", message);
    const request: WSRequest = JSON.parse(message as unknown as string);
    console.log("GOT Request: ", request);

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

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
