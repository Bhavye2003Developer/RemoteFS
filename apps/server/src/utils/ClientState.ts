import path from "path";
import FileDirManager from "./FileDirManager";
import { getHomeDir } from "./helper";
import { ItemToAdd, LocFile } from "@remotely/utils/types";

const basePath = getHomeDir();

class ClientState {
  IP = "";
  currentPath = basePath;
  pathStack = [this.currentPath];
  fileDirManager = new FileDirManager();
  // watcher: null | FSWatcher = null;

  constructor(ip: string | undefined) {
    this.IP = ip || "....";
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

    const files = this.fileDirManager.getPathFiles(this.currentPath);

    // if (this.watcher) this.watcher.close();
    // this.watcher = watch(this.currentPath, {
    //   depth: 0,
    //   ignoreInitial: true,
    // }).on("all", () => {
    // });

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

  async addItem(item: ItemToAdd) {
    const status = this.fileDirManager.addItem(this.currentPath, item);
    return status;
  }

  downloadFile(file: LocFile) {}
}

export default ClientState;
