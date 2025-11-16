export enum FILETYPE {
  "FILE" = 0,
  "DIR" = 1,
}

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
    // path?: string;
    // filesToDownload?: FileViewType[];
    dir?: string;
  };
};

export type FileViewType = { filename: string; filetype: FILETYPE };
