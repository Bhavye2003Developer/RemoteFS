"use client";

import { ArrowLeft, FilePlus, FolderPlus, Upload } from "lucide-react";
import useExpoStore from "~/store/useExpoStore";
import AddItemModal from "./AddItemModal";
import { DialogTrigger } from "./ui/dialog";
import Searcher from "./Searcher";
import useWebsocketStore from "~/store/useWebsocketStore";
import { useRef } from "react";
import { FILETYPE, WSRequestType } from "@remotely/utils/types";
import { formatText } from "@remotely/utils/helpers";
import { SERVER_PORT, SYSTEM_IP } from "@remotely/utils/constants";
import { toast } from "sonner";

export default function Header() {
  const { currentPath, goToPrevPath, isPathChild } = useExpoStore();
  const { isConnected, sendMessage } = useWebsocketStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const disabled = !isConnected;

  const statusColor = isConnected ? "bg-green-800" : "bg-red-500";

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isConnected) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; ++i)
      formData.append("ClientFiles", files[i]);

    try {
      const response = await fetch(
        `http://${SYSTEM_IP}:${SERVER_PORT}/upload?path=${encodeURIComponent(currentPath)}`,
        { method: "POST", body: formData }
      );
      const message = await response.text();
      toast(message, { duration: 3000 });
      if (response.ok) {
        sendMessage({ type: WSRequestType.FETCH, data: { dir: null } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="
        w-full rounded-2xl p-3 sm:p-5
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-800
        shadow-sm dark:shadow-black/30
        space-y-3 transition-colors
      "
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-2.5 h-2.5 rounded-full ${statusColor} animate-pulse`}
        />
        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          {isConnected ? "connected" : "disconnected"}
        </span>
      </div>

      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-all">
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          Current Path:
        </span>{" "}
        <span className="font-medium text-blue-800 dark:text-blue-300">
          {formatText(currentPath, 30)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          onClick={goToPrevPath}
          disabled={!isPathChild || disabled}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition
            ${
              isPathChild && !disabled
                ? "bg-gray-700 text-white border-transparent hover:bg-gray-600"
                : "bg-gray-200 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed opacity-60"
            }
          `}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <AddItemModal
          type="file"
          createItem={(filename) => {
            if (!isConnected) return;
            sendMessage({
              type: WSRequestType.ADD,
              data: { itemToBeAdded: { type: FILETYPE.FILE, name: filename } },
            });
          }}
        >
          <DialogTrigger
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition
              ${
                disabled
                  ? "bg-gray-200 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed opacity-60"
                  : "bg-blue-600 text-white border-transparent hover:bg-blue-700"
              }
            `}
          >
            <FilePlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add File</span>
          </DialogTrigger>
        </AddItemModal>

        <AddItemModal
          type="folder"
          createItem={(folderName) => {
            if (!isConnected) return;
            sendMessage({
              type: WSRequestType.ADD,
              data: { itemToBeAdded: { type: FILETYPE.DIR, name: folderName } },
            });
          }}
        >
          <DialogTrigger
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition
              ${
                disabled
                  ? "bg-gray-200 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed opacity-60"
                  : "bg-blue-600 text-white border-transparent hover:bg-blue-700"
              }
            `}
          >
            <FolderPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Folder</span>
          </DialogTrigger>
        </AddItemModal>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition
            ${
              disabled
                ? "bg-gray-200 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed opacity-60"
                : "bg-blue-600 text-white border-transparent hover:bg-blue-700"
            }
          `}
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onUpload}
          disabled={disabled}
        />
      </div>

      <Searcher />
    </div>
  );
}
