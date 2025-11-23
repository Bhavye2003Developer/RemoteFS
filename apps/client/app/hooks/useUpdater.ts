import { useEffect } from "react";
import useExpoStore from "~/store/useExpoStore";
import useWebsocketStore from "~/store/useWebsocketStore";
import { WSRequestType } from "@remotely/utils/types";
import { toast } from "sonner";

const useUpdater = () => {
  const {
    updatePath,
    updatePathFiles,
    currentDir,
    updateIsPathChild,
    step,
    updateSearchText,
  } = useExpoStore();

  const { connect, disconnect, isConnected, message, sendMessage } =
    useWebsocketStore();

  useEffect(() => {
    connect();
    return disconnect;
  }, []);

  useEffect(() => {
    if (isConnected) {
      sendMessage({
        type: WSRequestType.FETCH,
        data: {
          dir: currentDir,
        },
      });
    }
  }, [isConnected, currentDir, step]);

  useEffect(() => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.reqType === WSRequestType.FETCH) {
      const path = parsedMessage.path;
      updatePath(path);
      updateSearchText("");
      updatePathFiles(parsedMessage.files);
      updateIsPathChild(parsedMessage.isChild);
    }
    const wsMessage = parsedMessage.message;
    if (wsMessage) {
      console.log("Message: ", wsMessage);
      toast(wsMessage, {
        duration: 3000,
      });
    }
  }, [message]);
};

export default useUpdater;
