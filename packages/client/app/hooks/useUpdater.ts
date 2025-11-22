import { useEffect } from "react";
import useExpoStore from "~/store/useExpoStore";
import useWebsocketStore from "~/store/useWebsocketStore";
import { WSRequestType } from "~/utils/types";

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
    console.log(parsedMessage);
    if (parsedMessage.reqType === WSRequestType.FETCH) {
      const path = parsedMessage.path;
      console.log("PATH: ", path, currentDir);

      updatePath(path);
      updatePathFiles(parsedMessage.files);
      updateIsPathChild(parsedMessage.isChild);
      updateSearchText("");
    }
  }, [message]);
};

export default useUpdater;
