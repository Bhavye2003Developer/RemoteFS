import path from "path";
import FileDirManager from "./FileDirManager";
import { ItemToAdd, LocFile } from "@remotely/utils/types";
import { getHomeDir } from "@remotely/utils/helpers";

const basePath = getHomeDir();

class ClientState {
  IP = "";
  currentPath = basePath;
  pathStack = [basePath];
  fileDirManager = new FileDirManager();

  constructor(ip: string | undefined) {
    this.IP = ip || "....";
  }

  async fetchFiles(dir: string | null) {
    if (dir == "-") {
      this.pathStack.pop();
      const prevPath = this.pathStack[this.pathStack.length - 1] || basePath;
      this.currentPath = prevPath;
    } else if (dir && dir !== "/") {
      const updatedPath = path.join(this.currentPath, dir);
      this.currentPath = updatedPath;
      this.pathStack.push(updatedPath);
    } else if (dir == "/") {
      this.currentPath = basePath;
      this.pathStack = [basePath];
    }

    const isChild = this.pathStack.length > 1;

    console.log(this.currentPath, this.pathStack);

    const files = await this.fileDirManager.getPathFiles(this.currentPath);
    return { currentPath: this.currentPath, files, isChild };
  }

  removeFile(file: LocFile | null) {
    if (file) {
      const filename = file.name;
      const pathToDelete = path.join(this.currentPath, filename);
      return this.fileDirManager.removeItem(pathToDelete, file.type);
    }
    return 0;
  }

  async addItem(item: ItemToAdd) {
    const status = this.fileDirManager.addItem(this.currentPath, item);
    return status;
  }

  downloadFile(file: LocFile) {}
}

export default ClientState;
