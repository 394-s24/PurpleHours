import { Button } from "react-bootstrap";
import useQueueManager from "../utils/useQueueManager";
import TAQueue from "./TAQueue";
import { setGroupHelping, removeGroupAndIncrement } from "../database/DatabaseFuncs.js";

const TA = ({ queue, dbArgs }) => {
  const { refinedQueue, user, handleBack } = useQueueManager(queue, dbArgs);

  const handleDone = (groupId) => {
    // Remove the group from the database
    removeGroupAndIncrement(dbArgs, groupId);
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
