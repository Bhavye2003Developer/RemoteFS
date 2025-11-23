"use client";

import FilesViewer from "./FilesViewer";
import Header from "./Header";
import useExpoStore from "~/store/useExpoStore";
import useUpdater from "~/hooks/useUpdater";

const Explorer = () => {
  const { pathFiles } = useExpoStore();
  useUpdater();

  return (
    <div className="min-h-screen p-2 sm:p-6 bg-white dark:bg-black transition-colors">
      <div
        className="
          mx-auto
          w-full max-w-sm sm:max-w-lg md:max-w-3xl
          rounded-xl sm:rounded-2xl
          border border-gray-200 dark:border-gray-800
          bg-gray-50 dark:bg-gray-900
          shadow-sm dark:shadow-black/30
          p-3 sm:p-6
          space-y-4
        "
      >
        <Header />

        <div>
          <div
            className="
              rounded-lg sm:rounded-xl
              border border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-900
              p-2 sm:p-3
              space-y-2
              transition-colors
            "
          >
            {!pathFiles || pathFiles.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-10 text-sm sm:text-base">
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
