import {
  DownloadIcon,
  File as FileIcon,
  Folder as FolderIcon,
} from "lucide-react";
import useExpoStore from "~/store/useExpoStore";
import DeleteItemBtn from "./DeleteItemBtn";
import useWebsocketStore from "~/store/useWebsocketStore";
import { FILETYPE, WSRequestType } from "@remotely/utils/types";
import { formatText } from "@remotely/utils/helpers";
import { SERVER_PORT, SYSTEM_IP } from "@remotely/utils/constants";

export default function FilesViewer() {
  const { pathFiles, changeDir, searchText } = useExpoStore();
  const { sendMessage, isConnected } = useWebsocketStore();

  return (
    <div className="space-y-2">
      {pathFiles &&
        pathFiles
          .filter((f) =>
            f.name.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((file, i) => (
            <div
              key={i}
              onClick={() => file.type === FILETYPE.DIR && changeDir(file.name)}
              className="
                flex items-center justify-between
                rounded-xl px-4 py-3 sm:px-3 sm:py-2
                border border-gray-200 dark:border-gray-800
                bg-white dark:bg-gray-900
                transition-colors cursor-pointer select-none
                hover:bg-gray-100 dark:hover:bg-gray-800
              "
            >
              <div className="flex items-center gap-3">
                {file.type === FILETYPE.DIR ? (
                  <FolderIcon className="w-5 h-5 text-green-700 dark:text-green-300 sm:w-4 sm:h-4" />
                ) : (
                  <FileIcon className="w-5 h-5 text-yellow-700 dark:text-yellow-300 sm:w-4 sm:h-4" />
                )}

                <span className="font-medium break-all text-gray-800 dark:text-gray-200 sm:text-sm">
                  {formatText(file.name)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`http://${SYSTEM_IP}:${SERVER_PORT}/download?fileInfo=${encodeURIComponent(JSON.stringify(file))}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-lg transition text-blue-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <DownloadIcon className="w-4 h-4" />
                </a>

                <DeleteItemBtn
                  filename={file.name}
                  deleteItem={() => {
                    if (!isConnected) return;
                    sendMessage({ type: WSRequestType.DELETE, data: { file } });
                  }}
                />
              </div>
            </div>
          ))}
    </div>
  );
}
