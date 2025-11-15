import { readdirSync, rmSync, unlinkSync } from "fs";
// import archiver from "archiver";
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

  async removeItem(pathToDelete: string, fileType: FILETYPE) {
    console.log("To Remove: ", pathToDelete, fileType);
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
      console.log(err);
      return 0;
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
