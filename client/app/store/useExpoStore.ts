import { create } from "zustand";
import type { LocFile } from "~/utils/types";

interface ExpoStore {
  currentPath: string;
  pathFiles: LocFile[] | null;
  currentDir: string;
  isPathChild: boolean;
  step: number;

  updatePath: (updatedPath: string) => void;
  updatePathFiles: (files: LocFile[] | null) => void;
  goToPrevPath: () => void;
  changeDir: (dir: string) => void;
  updateIsPathChild: (isPathChild: boolean) => void;
}

const useExpoStore = create<ExpoStore>((set, get) => ({
  currentPath: "/",
  pathFiles: [],
  currentDir: "/",
  isPathChild: false,
  step: 0,

  updatePath(updatedPath) {
    set((state) => ({
      ...state,
      currentPath: updatedPath,
    }));
  },
  updatePathFiles(files) {
    set((state) => ({ ...state, pathFiles: files }));
  },

  goToPrevPath() {
    set((state) => ({
      ...state,
      currentDir: undefined,
      step: state.step + 1,
    }));
  },
  changeDir(dir) {
    set((state) => ({
      ...state,
      currentDir: dir,
      step: state.step + 1,
    }));
  },
  updateIsPathChild(isPathChild) {
    set((state) => ({ ...state, isPathChild }));
  },
}));

export default useExpoStore;
