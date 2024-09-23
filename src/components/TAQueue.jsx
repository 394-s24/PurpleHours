import { useContext, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

import UserContext from "./UserContext";
import Queue from "./Queue";

const TAQueue = ({ queue, handleDone, handleHelping, handlePutBack, course }) => {
  const user = useContext(UserContext);

  const [loadingGroup, setLoadingGroup] = useState(null); // Track which group is loading

  const handleDoneClick = async (groupId) => {
    setLoadingGroup(groupId); // Set the group as loading
    await handleDone(groupId);
    setLoadingGroup(null); // Reset loading state
  };

  const handleHelpingClick = async (groupId) => {
    setLoadingGroup(groupId); // Set the group as loading
    await handleHelping(groupId);
    setLoadingGroup(null); // Reset loading state
  };

  const handlePutBackClick = async (groupId) => {
    setLoadingGroup(groupId); // Set the group as loading
    await handlePutBack(groupId);
    setLoadingGroup(null); // Reset loading state
  };

  const renderCurrentlyHelpingButton = (group) => {
    if (group.helper.uid === user.uid) {
      return (
        <div className="button-group">
          <Button
            className="done-btn"
            onClick={() => handleDoneClick(group.id)}
            variant="success"
            disabled={loadingGroup === group.id} // Disable button while loading
          >
            {loadingGroup === group.id ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Done"
            )}
          </Button>
          <Button
            className="put-back-btn"
            onClick={() => handlePutBackClick(group.id)}
            variant="secondary"
            disabled={loadingGroup === group.id} // Disable button while loading
          >
            {loadingGroup === group.id ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Put Back"
            )}
          </Button>
        </div>
      );
    }
    return null;
  };

  const renderUpcomingButton = (group) => (
    <Button
      className="help-btn"
      onClick={() => handleHelpingClick(group.id)}
      variant="primary"
      disabled={loadingGroup === group.id} // Disable button while loading
    >
      {loadingGroup === group.id ? (
        <Spinner as="span" animation="border" size="sm" />
      ) : (
        "Help"
      )}
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
      loadingGroup={loadingGroup}
      course={course}
    />
  );
};

export default TAQueue;
