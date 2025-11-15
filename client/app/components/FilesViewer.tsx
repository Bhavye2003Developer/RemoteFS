import { File, Folder } from "lucide-react";
import useExpoStore from "~/store/useExpoStore";
import { formatText } from "~/utils/helper";
import { FILETYPE } from "~/utils/types";

export default function FilesViewer() {
  const { pathFiles, changeDir } = useExpoStore();

  return (
    <div className="space-y-2">
      {pathFiles &&
        pathFiles.map((file, i) => (
          <div
            key={i}
            className="
              flex justify-between items-center 
              rounded-xl px-4 py-3 
              border cursor-pointer transition-all

              bg-white hover:bg-gray-50 hover:shadow-md border-gray-200
              dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:hover:shadow-lg
            "
            onClick={() => file.type === FILETYPE.DIR && changeDir(file.name)}
          >
            <div className="flex items-center gap-3">
              {file.type === FILETYPE.DIR ? (
                <Folder
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
              ) : (
                <File size={20} className="text-gray-700 dark:text-gray-300" />
              )}

              <span
                className="
                  font-medium select-none break-all
                  text-gray-800 dark:text-gray-200
                "
              >
                {formatText(file.name)}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
