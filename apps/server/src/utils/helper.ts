import { createWriteStream, existsSync, mkdirSync } from "fs";
import archiver from "archiver";
import { LocFile } from "@remotely/utils/types";
import { generateHash } from "@remotely/utils/helpers";

export function generatePasscodeHash() {
  const min = 100000;
  const max = 999999;
  const passcode = "" + (Math.floor(Math.random() * (max - min + 1)) + min);
  console.log("Client Password: ", passcode);
  const passcodeHash = generateHash(passcode);
  return passcodeHash;
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
