import { useEffect, type RefObject } from "react";
import type WebsocketService from "~/service/WebsocketService";
import useExpoStore from "~/store/useExpoStore";
import { useWebSocketStore } from "~/store/useWebsocketStore";
import { WSRequestType } from "~/utils/types";

const useUpdater = (websocketService: RefObject<WebsocketService>) => {
  const {
    updatePath,
    updatePathFiles,
    currentDir,
    updateIsPathChild,
    step,
    fileToDelete,
    itemToBeAdded,
  } = useExpoStore();
  const { connectionStatus, message } = useWebSocketStore();

  useEffect(() => {
    if (connectionStatus === "connected") {
      websocketService.current.sendMessage(
        JSON.stringify({
          type: WSRequestType.FETCH,
          data: {
            dir: currentDir,
          },
        })
      );
    }
  }, [connectionStatus, currentDir, step]);

  useEffect(() => {
    websocketService.current.sendMessage(
      JSON.stringify({
        type: WSRequestType.DELETE,
        data: {
          file: fileToDelete,
        },
      })
    );
  }, [fileToDelete]);

  useEffect(() => {
    websocketService.current.sendMessage(
      JSON.stringify({
        type: WSRequestType.ADD,
        data: {
          itemToBeAdded,
        },
      })
    );
  }, [itemToBeAdded]);

  useEffect(() => {
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    if (parsedMessage.reqType === WSRequestType.FETCH) {
      const path = parsedMessage.path;
      console.log("PATH: ", path, currentDir);

      updatePath(path);
      updatePathFiles(parsedMessage.files);
      updateIsPathChild(parsedMessage.isChild);
    }
  }, [message]);
};

export default useUpdater;
