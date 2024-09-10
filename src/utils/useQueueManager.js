import { useState, useEffect, useContext } from "react";

import UserContext from "../components/UserContext";
import { formatQueue } from "./queueUtils";

const useQueueManager = (initialQueue, initialArgs) => {
  const [refinedQueue, setRefinedQueue] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    setRefinedQueue(formatQueue(initialQueue || [])); 
  }, [initialQueue, initialArgs]);

  return {
    refinedQueue,
    user,
  };
};

export default useQueueManager;
