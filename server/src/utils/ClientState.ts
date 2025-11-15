import path from "path";
import { getHomeDir } from "../../../utils/helper";
import FileDirManager from "./FileDirManager";
import { LocFile } from "./types";

const basePath = getHomeDir();

class ClientState {
  IP = "";
  currentPath = basePath;
  pathStack = [this.currentPath];
  fileDirManager = new FileDirManager();

  constructor(ip: string | undefined) {
    this.IP = ip || "....";
    console.log("Client with IP: ", this.IP);
  }

  fetchFiles(dir: string) {
    if (dir && dir !== "/") {
      const updatedPath = path.join(this.currentPath, dir);
      this.currentPath = updatedPath;
      this.pathStack.push(this.currentPath);
    } else if (!dir) {
      this.pathStack.pop();
      const prevPath = this.pathStack[this.pathStack.length - 1] || basePath;
      this.currentPath = prevPath;
    }

    const isChild = this.pathStack.length > 1;
    console.log(this.pathStack, this.currentPath);

    const files = this.fileDirManager.getPathFiles(this.currentPath);
    return { files, isChild };
  }

  removeFile(file: LocFile | null) {
    if (file) {
      const filename = file.name;
      const pathToDelete = path.join(this.currentPath, filename);
      return this.fileDirManager.removeItem(pathToDelete, file.type);
    }
    return 0;
  }
}

export default ClientState;
