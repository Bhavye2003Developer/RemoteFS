"use client";

import FilesViewer from "./FilesViewer";
import Header from "./Header";
import useExpoStore from "~/store/useExpoStore";
import useUpdater from "~/hooks/useUpdater";

const Explorer = () => {
  const { pathFiles } = useExpoStore();

  useUpdater();

  return (
    <div className="min-h-screen p-1 sm:p-3 wrap-anywhere">
      <div
        className="
          mx-auto  
          rounded-xl sm:rounded-2xl 
          shadow-lg 
          border border-gray-200
          
          w-full
          max-w-sm
          sm:max-w-lg
          md:max-w-3xl

          p-2 sm:p-4 md:p-6 
          space-y-4 sm:space-y-5
        "
      >
        <Header />

        <div>
          <div
            className="
              rounded-lg sm:rounded-xl 
              border 
              space-y-2 
              p-1 sm:p-2
            "
          >
            {!pathFiles || pathFiles.length === 0 ? (
              <p className="text-gray-500 text-xs sm:text-sm text-center py-4 sm:py-6">
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
