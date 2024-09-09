import { useContext } from "react";
import { Button } from "react-bootstrap";

import UserContext from "./UserContext";
import Queue from "./Queue";

const TAQueue = ({ queue, handleDone, handleHelping, handlePutBack }) => {
  const user = useContext(UserContext);

  const renderCurrentlyHelpingButton = (group) => {
    if (group.helper.uid === user.uid) {
      return (
        <div className="button-group">
          <Button
            className="done-btn"
            onClick={() => handleDone(group.id)}
            variant="success"
          >
            Done
          </Button>
          <Button
            className="put-back-btn"
            onClick={() => handlePutBack(group.id)}
            variant="secondary"
          >
            Put Back
          </Button>
        </div>
      );
    }
    return null;
  };

  const renderUpcomingButton = (group) => (
    <Button
      className="help-btn"
      onClick={() => handleHelping(group.id)}
      variant="primary"
    >
      Help
    </Button>
  );

  return (
    <Queue
      queue={queue}
      user={user}
      title="Welcome"
      currentlyHelpingTitle="Currently helping"
      upcomingTitle="Upcoming"
      renderCurrentlyHelpingButton={renderCurrentlyHelpingButton}
      renderUpcomingButton={renderUpcomingButton}
    />
  );
};

export default TAQueue;
