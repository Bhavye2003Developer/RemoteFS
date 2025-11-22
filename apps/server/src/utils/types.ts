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
  data: {
    dir?: string;
    file?: LocFile | null;
    itemToBeAdded?: ItemToAdd;
  };
};

export type ItemToAdd = {
  type: FILETYPE;
  name: string;
};

export type FileViewType = { filename: string; filetype: FILETYPE };

export type LocFile = { name: string; type: FILETYPE; path: string };
