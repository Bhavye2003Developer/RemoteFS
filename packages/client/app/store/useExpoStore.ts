import { create } from "zustand";
import type { ItemToAdd, LocFile } from "~/utils/types";

interface ExpoStore {
  currentPath: string;
  pathFiles: LocFile[] | null;
  currentDir: string;
  isPathChild: boolean;
  step: number;
  fileToDelete: LocFile | null;
  itemToBeAdded: ItemToAdd | null;
  searchText: string;

  updatePath: (updatedPath: string) => void;
  updatePathFiles: (files: LocFile[] | null) => void;
  goToPrevPath: () => void;
  changeDir: (dir: string) => void;
  updateIsPathChild: (isPathChild: boolean) => void;
  updateFileToDelete: (file: LocFile | null) => void;
  addItem: (itemToBeAdded: ItemToAdd) => void;
  updateSearchText: (text: string) => void;
}

const useExpoStore = create<ExpoStore>((set, get) => ({
  currentPath: "/",
  pathFiles: [],
  currentDir: "/",
  isPathChild: false,
  step: 0,
  fileToDelete: null,
  itemToBeAdded: null,
  searchText: "",

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
  updateFileToDelete(file) {
    set((state) => ({ ...state, fileToDelete: file }));
  },
  addItem(itemToBeAdded) {
    set((state) => ({ ...state, itemToBeAdded: itemToBeAdded }));
  },
  updateSearchText(text) {
    set((state) => ({ ...state, searchText: text }));
  },
}));

export default useExpoStore;
