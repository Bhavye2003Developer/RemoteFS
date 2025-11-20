import path from "path";
import os from "os";

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
