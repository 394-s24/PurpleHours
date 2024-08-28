import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../components/UserContext";
import { formatQueue } from "./queueUtils";

const useQueueManager = (initialQueue, initialArgs) => {
  const [refinedQueue, setRefinedQueue] = useState([]);
  const user = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialArgs) {
      navigate("/");
      return;
    }
    setRefinedQueue(formatQueue(initialQueue));
  }, [initialQueue, initialArgs, navigate]);

  const handleBack = () => navigate("/");

  return {
    refinedQueue,
    user,
    handleBack,
  };
};

export default useQueueManager;
