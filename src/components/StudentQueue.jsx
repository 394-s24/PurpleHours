import { useContext } from "react";
import { Button } from "react-bootstrap";
import UserContext from "./UserContext";
import Queue from "./Queue";

const StudentQueue = ({ queue, course, joinQueue, leaveQueue }) => {
  const user = useContext(UserContext);

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
      !group.names.some((object) => object.uid === user.uid)
    ) {
      return (
        <Button
          className="join-btn"
          onClick={() => joinQueue(course, group.id)}
          variant="success"
        >
          Join
        </Button>
      );
    }
    if (group.names.some((object) => object.uid === user.uid)) {
      return (
        <Button
          className="leave-btn"
          onClick={() => leaveQueue(course, group.id)}
          variant="danger"
        >
          Leave
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
    />
  );
};

export default StudentQueue;
