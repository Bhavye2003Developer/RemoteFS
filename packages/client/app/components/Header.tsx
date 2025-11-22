"use client";

import { ArrowLeft, FilePlus, FolderPlus } from "lucide-react";
import useExpoStore from "~/store/useExpoStore";
import { formatText } from "~/utils/helper";
import AddItemModal from "./AddItemModal";
import { DialogTrigger } from "./ui/dialog";
import { FILETYPE, WSRequestType } from "~/utils/types";
import Searcher from "./Searcher";
import useWebsocketStore from "~/store/useWebsocketStore";

export default function Header() {
  const { currentPath, goToPrevPath, isPathChild } = useExpoStore();
  const { isConnected, sendMessage } = useWebsocketStore();

  const statusColor = isConnected ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className="w-full rounded-2xl p-5 shadow-md border space-y-4
      bg-white border-gray-200 
      dark:bg-gray-900 dark:border-gray-700 dark:shadow-lg"
    >
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${statusColor} animate-pulse`} />
        <span className="text-sm text-gray-700 capitalize dark:text-gray-300">
          {isConnected ? "connected" : "disconnected"}
        </span>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 break-all">
        <span className="font-semibold text-gray-900 dark:text-gray-200">
          Current Path:
        </span>{" "}
        <span className="text-blue-600 dark:text-blue-400 font-medium">
          {formatText(currentPath, 30)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border 
            ${
              isPathChild
                ? "bg-gray-900 text-white border-transparent hover:bg-gray-700 shadow dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white"
                : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600"
            }`}
          onClick={goToPrevPath}
          disabled={!isPathChild}
        >
          <ArrowLeft size={18} />
        </button>

        <AddItemModal
          type="file"
          createItem={(filename) => {
            sendMessage({
              type: WSRequestType.ADD,
              data: {
                itemToBeAdded: {
                  type: FILETYPE.FILE,
                  name: filename,
                },
              },
            });
          }}
        >
          <DialogTrigger
            className="
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
              bg-blue-600 text-white hover:bg-blue-700 shadow
              dark:bg-blue-500 dark:hover:bg-blue-400
            "
          >
            <FilePlus size={18} />
            Add File
          </DialogTrigger>
        </AddItemModal>

        <AddItemModal
          type="folder"
          createItem={(folderName) => {
            sendMessage({
              type: WSRequestType.ADD,
              data: {
                itemToBeAdded: {
                  type: FILETYPE.DIR,
                  name: folderName,
                },
              },
            });
          }}
        >
          <DialogTrigger
            className="
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
              bg-green-600 text-white hover:bg-green-700 shadow
              dark:bg-green-500 dark:hover:bg-green-400
            "
          >
            <FolderPlus size={18} />
            Add Folder
          </DialogTrigger>
        </AddItemModal>
      </div>
      <Searcher />
    </div>
  );
}
