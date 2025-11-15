import { readdirSync, createWriteStream } from "fs";
// import archiver from "archiver";
import { existsSync, mkdirSync } from "fs";
import { FILETYPE } from "../../../utils/types";

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

  // generateArchive(files: FileViewType[]) {
  //   const outputDir = "./output/";

  //   if (!existsSync(outputDir)) {
  //     console.log("Output dir not found");
  //     mkdirSync(outputDir);
  //   }

  //   const zipname = outputDir + new Date().valueOf().toString() + ".zip";
  //   return new Promise((resolve, reject) => {
  //     const outputzip = createWriteStream(zipname);
  //     const archive = archiver("zip", {
  //       zlib: { level: 9 },
  //     });
  //     outputzip.on("close", () => {
  //       console.log(archive.pointer() + " total bytes");
  //       resolve(zipname);
  //     });

  //     archive.pipe(outputzip);

  //     files.forEach((file) => {
  //       const filename = file.filename;
  //       const type = file.filetype;
  //       if (type === FILETYPE.DIR) archive.directory(filename, filename);
  //       else archive.file(filename, { name: filename });
  //     });

  //     archive.finalize();
  //   });
  // }
}

export default FileDirManager;
