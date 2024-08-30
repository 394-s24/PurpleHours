import { Button } from "react-bootstrap";
import useQueueManager from "../utils/useQueueManager";
import TAQueue from "./TAQueue";
import { setGroupHelping, removeGroupAndIncrement, useDbData } from "../database/DatabaseFuncs.js";

const TA = ({ dbArgs }) => {

  const course = "cs211"

  const [queue, error] = useDbData(course);

  const { refinedQueue, user, handleBack } = useQueueManager(queue, course);

  const handleDone = (groupId) => {
    // Remove the group from the database
    removeGroupAndIncrement(course, groupId);
  };

  const handleHelping = (groupId) => {
    setGroupHelping(course, groupId, user);
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
