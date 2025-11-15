"use client";

import { useEffect, useRef } from "react";
import FilesViewer from "./FilesViewer";
import Header from "./Header";
import useExpoStore from "~/store/useExpoStore";
import WebsocketService from "~/service/WebsocketService";
import useUpdater from "~/hooks/useUpdater";

const Explorer = () => {
  const { pathFiles } = useExpoStore();

  const websocketService = useRef(new WebsocketService());

  useUpdater(websocketService);

  useEffect(() => {
    websocketService.current.connect();
    return () => websocketService.current.disconnect();
  }, []);

  return (
    <div className="min-h-screen p-1 wrap-anywhere">
      <div className="max-w-3xl mx-auto rounded-2xl shadow-lg p-2.5 pt-3 space-y-5 border border-gray-200">
        <Header />

        <div>
          <div className="rounded-xl border space-y-2">
            {!pathFiles || pathFiles.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-3">
                No files found...
              </p>
            ) : (
              <FilesViewer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
