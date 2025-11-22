import { DownloadIcon, File, Folder } from "lucide-react";
import useExpoStore from "~/store/useExpoStore";
import DeleteItemBtn from "./DeleteItemBtn";
import useWebsocketStore from "~/store/useWebsocketStore";
import { FILETYPE, WSRequestType } from "@remotely/utils/types";
import { formatText } from "@remotely/utils/helpers";
import { SERVER_PORT, SYSTEM_IP } from "@remotely/utils/constants";

export default function FilesViewer() {
  const { pathFiles, changeDir, searchText } = useExpoStore();
  const { sendMessage } = useWebsocketStore();

  return (
    <div className="space-y-2 m-2">
      {pathFiles &&
        pathFiles
          .filter((file) =>
            file.name.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((file, i) => (
            <div
              key={i}
              className="
                flex items-center justify-between
                rounded-xl px-4 py-3 
                sm:px-3 sm:py-2
                border cursor-pointer transition-all
                hover:text-black hover:bg-green-100 hover:shadow-md 
                border-gray-200
                dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:hover:shadow-lg
              "
              onClick={() => file.type === FILETYPE.DIR && changeDir(file.name)}
            >
              <div className="flex items-center gap-3">
                {file.type === FILETYPE.DIR ? (
                  <Folder
                    size={20}
                    className="text-yellow-700 dark:text-yellow-300 sm:size-[18px]"
                  />
                ) : (
                  <File
                    size={20}
                    className="text-gray-700 dark:text-gray-300 sm:size-[18px]"
                  />
                )}

                <span className="font-medium select-none break-all text-gray-800 dark:text-gray-200 sm:text-sm">
                  {formatText(file.name)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`http://${SYSTEM_IP}:${SERVER_PORT}/download?fileInfo=${encodeURIComponent(
                    JSON.stringify(file)
                  )}`}
                  onClick={(e) => e.stopPropagation()}
                  className="
                    p-2 sm:p-1.5 
                    rounded-lg hover:bg-blue-600 hover:text-white 
                    transition text-blue-600 dark:text-blue-400
                  "
                >
                  <DownloadIcon size={18} className="sm:size-4" />
                </a>

                <DeleteItemBtn
                  filename={file.name}
                  deleteItem={() => {
                    sendMessage({
                      type: WSRequestType.DELETE,
                      data: { file },
                    });
                  }}
                />
              </div>
            </div>
          ))}
    </div>
  );
}
