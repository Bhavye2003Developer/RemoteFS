import { useEffect, type RefObject } from "react";
import type WebsocketService from "~/service/WebsocketService";
import useExpoStore from "~/store/useExpoStore";
import { useWebSocketStore } from "~/store/useWebsocketStore";
import { WSRequestType } from "~/utils/types";

const useUpdater = (websocketService: RefObject<WebsocketService>) => {
  const { updatePath, updatePathFiles, currentDir, updateIsPathChild, step } =
    useExpoStore();
  const { connectionStatus, message } = useWebSocketStore();

  useEffect(() => {
    if (connectionStatus === "connected") {
      websocketService.current.sendMessage(
        JSON.stringify({
          type: WSRequestType.FETCH,
          dir: currentDir,
        })
      );
    }
  }, [connectionStatus, currentDir, step]);

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
