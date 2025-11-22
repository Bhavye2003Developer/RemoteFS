import path from "path";
import os from "os";
import { LocFile } from "./types";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import archiver from "archiver";

export const formatText = (filename: string, len: number = 20) => {
  if (filename.length > len) return filename.slice(0, len) + "...";
  return filename;
};

export const chdir = (curpath: string, dirname: string) => {
  const updatedPath = path.join(curpath, dirname);
  console.log(updatedPath);
  return updatedPath;
};

export function getHomeDir() {
  const homedir = os.homedir();
  return homedir;
}

export function generateArchive(file: LocFile) {
  const outputDir = "./output/";

  if (!existsSync(outputDir)) {
    console.log("Output dir not found");
    mkdirSync(outputDir);
  }

  const zipname =
    outputDir +
    file.name +
    // new Date().valueOf().toString()
    ".zip";
  return new Promise((resolve, reject) => {
    const outputzip = createWriteStream(zipname);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });
    outputzip.on("close", () => {
      console.log(archive.pointer() + " total bytes");
      resolve(zipname);
    });

    archive.pipe(outputzip);

    const filename = file.name;
    archive.directory(filename, filename);
    archive.finalize();
  });
}
