"use client";

import { ArrowLeft, FilePlus, FolderPlus, UploadCloud } from "lucide-react";
import useExpoStore from "~/store/useExpoStore";
import AddItemModal from "./AddItemModal";
import { DialogTrigger } from "./ui/dialog";
import Searcher from "./Searcher";
import useWebsocketStore from "~/store/useWebsocketStore";
import { useRef } from "react";
import { FILETYPE, WSRequestType } from "@remotely/utils/types";
import { formatText } from "@remotely/utils/helpers";
import { SERVER_PORT, SYSTEM_IP } from "@remotely/utils/constants";

export default function Header() {
  const { currentPath, goToPrevPath, isPathChild } = useExpoStore();
  const { isConnected, sendMessage } = useWebsocketStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const disabledClass = !isConnected
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  const statusColor = isConnected ? "bg-green-500" : "bg-red-500";

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isConnected) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; ++i)
      formData.append("ClientFiles", files[i]);

    try {
      const response = await fetch(
        `http://${SYSTEM_IP}:${SERVER_PORT}/upload?path=${encodeURIComponent(
          currentPath
        )}`,
        { method: "POST", body: formData }
      );

      if (response.ok) {
        sendMessage({ type: WSRequestType.FETCH, data: { dir: "/" } });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="
        w-full rounded-2xl p-3 sm:p-5
        shadow-md border space-y-3 sm:space-y-4
        bg-white border-gray-200 
        dark:bg-gray-900 dark:border-gray-700 dark:shadow-lg
      "
    >
      {/* Status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${statusColor} animate-pulse`}
        />
        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          {isConnected ? "connected" : "disconnected"}
        </span>
      </div>

      {/* Current Path */}
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-all">
        <span className="font-semibold text-gray-900 dark:text-gray-200">
          Current Path:
        </span>{" "}
        <span className="text-blue-600 dark:text-blue-400 font-medium">
          {formatText(currentPath, 30)}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* BACK */}
        <button
          disabled={!isPathChild || !isConnected}
          onClick={goToPrevPath}
          className={`
            flex items-center gap-1.5 sm:gap-2
            px-3 sm:px-4 py-1.5 sm:py-2.5
            rounded-lg sm:rounded-xl 
            text-xs sm:text-sm font-medium transition-all border
            ${
              isPathChild && isConnected
                ? "bg-gray-900 text-white border-transparent hover:bg-gray-700 shadow dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white"
                : "bg-gray-200 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600"
            }
            ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <ArrowLeft className="size-4 sm:size-[18px]" />
          <span className="hidden sm:block">Back</span>
        </button>

        {/* ADD FILE */}
        <AddItemModal
          type="file"
          createItem={(filename) =>
            isConnected &&
            sendMessage({
              type: WSRequestType.ADD,
              data: { itemToBeAdded: { type: FILETYPE.FILE, name: filename } },
            })
          }
        >
          <DialogTrigger
            className={`
              flex items-center gap-1.5 sm:gap-2
              px-3 sm:px-4 py-1.5 sm:py-2.5
              rounded-lg sm:rounded-xl 
              text-xs sm:text-sm font-medium transition-all
              bg-blue-600 text-white hover:bg-blue-700 shadow
              dark:bg-blue-500 dark:hover:bg-blue-400
              ${disabledClass}
            `}
          >
            <FilePlus className="size-4 sm:size-[18px]" />
            <span className="hidden sm:block">Add File</span>
          </DialogTrigger>
        </AddItemModal>

        {/* ADD FOLDER */}
        <AddItemModal
          type="folder"
          createItem={(folderName) =>
            isConnected &&
            sendMessage({
              type: WSRequestType.ADD,
              data: { itemToBeAdded: { type: FILETYPE.DIR, name: folderName } },
            })
          }
        >
          <DialogTrigger
            className={`
              flex items-center gap-1.5 sm:gap-2
              px-3 sm:px-4 py-1.5 sm:py-2.5
              rounded-lg sm:rounded-xl 
              text-xs sm:text-sm font-medium transition-all
              bg-green-600 text-white hover:bg-green-700 shadow
              dark:bg-green-500 dark:hover:bg-green-400
              ${disabledClass}
            `}
          >
            <FolderPlus className="size-4 sm:size-[18px]" />
            <span className="hidden sm:block">Add Folder</span>
          </DialogTrigger>
        </AddItemModal>

        {/* UPLOAD */}
        <button
          disabled={!isConnected}
          onClick={() => fileInputRef.current?.click()}
          className={`
            flex items-center gap-1.5 sm:gap-2
            px-3 sm:px-4 py-1.5 sm:py-2.5
            rounded-lg sm:rounded-xl 
            text-xs sm:text-sm font-medium transition-all
            bg-purple-600 text-white hover:bg-purple-700 shadow
            dark:bg-purple-500 dark:hover:bg-purple-400
            ${disabledClass}
          `}
        >
          <UploadCloud className="size-4 sm:size-[18px]" />
          <span className="hidden sm:block">Upload</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onUpload}
          disabled={!isConnected}
        />
      </div>

      <Searcher />
    </div>
  );
}
