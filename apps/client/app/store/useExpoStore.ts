import { LocFile } from "@remotely/utils/types";
import { create } from "zustand";

interface ExpoStore {
  currentPath: string;
  currentDir: string;
  pathFiles: LocFile[] | null;
  isPathChild: boolean;
  step: number;
  searchText: string;
  isClientVerified: boolean;

  updatePath: (updatedPath: string) => void;
  updatePathFiles: (files: LocFile[] | null) => void;
  goToPrevPath: () => void;
  changeDir: (dir: string) => void;
  updateIsPathChild: (isPathChild: boolean) => void;
  updateSearchText: (text: string) => void;
  toggleClientVerified: () => void;
}

const useExpoStore = create<ExpoStore>((set, get) => ({
  currentPath: "/",
  currentDir: "/",
  pathFiles: [],
  isPathChild: false,
  step: 0,
  searchText: "",
  isClientVerified: false,

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
      currentDir: "-",
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
  updateSearchText(text) {
    set((state) => ({ ...state, searchText: text }));
  },
  toggleClientVerified() {
    set((state) => ({ ...state, isClientVerified: !state.isClientVerified }));
  },
}));

export default useExpoStore;
