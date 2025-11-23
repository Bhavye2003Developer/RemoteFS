import path from "path";
import os from "os";

export const formatText = (filename: string, len: number = 20) => {
  if (filename.length > len) return filename.slice(0, len) + "...";
  return filename;
};

export const chdir = (curpath: string, dirname: string) => {
  const updatedPath = path.join(curpath, dirname);
  return updatedPath;
};

export function getHomeDir() {
  const homedir = os.homedir();
  return homedir;
}

export function generateHash(data: string) {
  let hash = 0;
  for (const char of data) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return hash;
}
