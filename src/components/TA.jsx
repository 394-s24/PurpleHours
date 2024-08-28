import { Button } from "react-bootstrap";
import useQueueManager from "../utils/useQueueManager";
import TAQueue from "./TAQueue";
import { removeGroup, setGroupHelping } from "../DatabaseFuncs.js";

const TA = ({ queue, dbArgs }) => {
  const { refinedQueue, user, handleBack } = useQueueManager(queue, dbArgs);

  const handleDone = (groupId) => {
    removeGroup(dbArgs, groupId);
  };

  const handleHelping = (groupId) => {
    setGroupHelping(dbArgs, groupId, user);
  };

  return (
    <div className="ta_view">
      <Button
        className="go_back_btn"
        variant="outline-light"
        onClick={() => handleBack()}
      >
        Go Back
      </Button>
      <TAQueue
        queue={refinedQueue}
        handleDone={handleDone}
        handleHelping={handleHelping}
      />
    </div>
  );
};

export default TA;
