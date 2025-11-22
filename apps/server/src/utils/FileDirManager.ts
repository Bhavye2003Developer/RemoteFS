import { FILETYPE, ItemToAdd } from "@remotely/utils/types";
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  rmSync,
  unlinkSync,
} from "fs";
import path from "path";

class FileDirManager {
  async getPathFiles(formattedPath: string) {
    try {
      const files = readdirSync(formattedPath, {
        withFileTypes: true,
        recursive: false,
      });
      const formattedFiles = files.map((file) => {
        return {
          name: file.name,
          type: file.isFile() === true ? FILETYPE.FILE : FILETYPE.DIR,
          path: formattedPath,
        };
      });
      return formattedFiles;
    } catch (err: any) {
      return null;
    }
  }

  async removeItem(pathToDelete: string, fileType: FILETYPE) {
    try {
      if (fileType === FILETYPE.FILE) {
        unlinkSync(pathToDelete);
      } else {
        rmSync(pathToDelete, {
          recursive: true,
        });
      }
      return 1;
    } catch (err) {
      console.log("ERROR: ", err);
      return 0;
    }
  }

  addItem(currentPath: string, item: ItemToAdd) {
    const { name, type } = item;
    const pathToCreate = path.join(currentPath, name);
    try {
      if (existsSync(pathToCreate)) {
        console.log("Already exists");
        return 1;
      }
      if (type === FILETYPE.FILE) closeSync(openSync(pathToCreate, "w"));
      else mkdirSync(pathToCreate);
      return 1;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
}

export default FileDirManager;
