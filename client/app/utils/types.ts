export enum FILETYPE {
  "FILE" = 0,
  "DIR" = 1,
}

export enum SelectionAction {
  "ADD",
  "REMOVE",
}

export type SelectedFilesType = {
  [key: string]: FILETYPE;
};

export enum WSRequestType {
  "INIT",
  "FETCH",
  "DOWNLOAD",
  "ADD",
  "DELETE",
}

export type WSRequest = {
  type: WSRequestType;
  dir: string;
  data: {
    path?: string;
    filesToDownload?: FileViewType[];
  };
};

export type FileViewType = { filename: string; filetype: FILETYPE };

export type LocFile = { name: string; type: FILETYPE; path: string };
