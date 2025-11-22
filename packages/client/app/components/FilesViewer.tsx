import { DownloadIcon, File, Folder } from "lucide-react";
import useExpoStore from "~/store/useExpoStore";
import { formatText } from "~/utils/helper";
import DeleteItemBtn from "./DeleteItemBtn";
import { FILETYPE, WSRequestType } from "~/utils/types";
import useWebsocketStore from "~/store/useWebsocketStore";

export default function FilesViewer() {
  const { pathFiles, changeDir, searchText } = useExpoStore();

  const { sendMessage } = useWebsocketStore();

  return (
    <div className="space-y-2 m-2">
      {pathFiles &&
        pathFiles
          .filter((file) => {
            if (file.name.toLowerCase().includes(searchText.toLowerCase()))
              return true;
            return false;
          })
          .map((file, i) => (
            <div
              key={i}
              className="
              flex items-center justify-between
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
                    className="text-yellow-700 dark:text-yellow-300"
                  />
                ) : (
                  <File
                    size={20}
                    className="text-gray-700 dark:text-gray-300"
                  />
                )}

                <span className="font-medium select-none break-all text-gray-800 dark:text-gray-200">
                  {formatText(file.name)}
                </span>
              </div>

              <a
                href={`http://localhost:3000/download?fileInfo=${encodeURIComponent(JSON.stringify(file))}`}
                onClick={(e) => e.stopPropagation()}
              >
                <DownloadIcon />
              </a>

              <DeleteItemBtn
                filename={file.name}
                deleteItem={() => {
                  sendMessage({
                    type: WSRequestType.DELETE,
                    data: {
                      file: file,
                    },
                  });
                }}
              />
            </div>
          ))}
    </div>
  );
}
