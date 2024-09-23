import { useContext, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

import UserContext from "./UserContext";
import Queue from "./Queue";

const StudentQueue = ({ queue, course, joinQueue, leaveQueue, inGroup }) => {
  const user = useContext(UserContext);

  const [loadingGroup, setLoadingGroup] = useState(null); // Track which group is loading

  const handleJoinQueue = async (course, groupId) => {
    setLoadingGroup(groupId); // Set the group as loading
    await joinQueue(course, groupId);
    setLoadingGroup(null); // Reset loading state
  };

  const handleLeaveQueue = async (course, groupId) => {
    setLoadingGroup(groupId); // Set the group as loading
    await leaveQueue(course, groupId);
    setLoadingGroup(null); // Reset loading state
  };

  const renderCurrentlyHelpingButton = (group) => null; // No special button for StudentQueue currently helping

  const renderUpcomingButton = (group) => {
    if (
      !group.public &&
      !group.names.some((object) => object.uid === user.uid)
    ) {
      return (
        <Button className="private-btn" variant="secondary" disabled>
          Private
        </Button>
      );
    }
    if (
      group.public &&
      !group.names.some((object) => object.uid === user.uid) &&
      !inGroup
    ) {
      return loadingGroup === group.id ? (
        null
      ) : (
        <Button
          className="join-btn"
          onClick={() => handleJoinQueue(course, group.id)}
          variant="success"
          disabled={loadingGroup === group.id} // Disable button while loading
        >
          Join
        </Button>
      );
    }
    if (group.names.some((object) => object.uid === user.uid)) {
      return loadingGroup === group.id ? (
        null
      ) : (
        <Button
          className="leave-btn"
          onClick={() => handleLeaveQueue(course, group.id)}
          variant="danger"
          disabled={loadingGroup === group.id} // Disable button while loading
        >
          {loadingGroup === group.id ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            "Leave"
          )}
        </Button>
      );
    }
    return null;
  };

  return (
    <Queue
      queue={queue}
      user={user}
      title="We are here to help"
      currentlyHelpingTitle="Currently helping"
      upcomingTitle="Upcoming"
      renderCurrentlyHelpingButton={renderCurrentlyHelpingButton}
      renderUpcomingButton={renderUpcomingButton}
      loadingGroup={loadingGroup}
      course={course}
    />
  );
};

export default StudentQueue;
