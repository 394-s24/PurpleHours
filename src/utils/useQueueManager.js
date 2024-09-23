import { useState, useEffect } from "react";

import { formatQueue } from "./queueUtils";

const useQueueManager = (initialQueue, initialArgs) => {
  const [refinedQueue, setRefinedQueue] = useState([]);

  useEffect(() => {
    setRefinedQueue(formatQueue(initialQueue || [])); 
  }, [initialQueue, initialArgs]);

  return refinedQueue
};

export default useQueueManager;
