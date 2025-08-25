import { notification } from "antd";
import { useCallback } from "react";

const useNotification = () => {
  const showNotification = useCallback((type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  }, []);

  return showNotification;
};

export default useNotification;
