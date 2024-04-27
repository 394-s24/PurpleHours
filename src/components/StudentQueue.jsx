import Group from "./Group";
import "./Queue.css";
import { ListGroup, Button } from "react-bootstrap";
import { useContext } from "react";
import UserContext from "../UserContext";

// The Queue component
const StudentQueue = ({ queue, studentData, joinQueue, leaveQueue }) => {
  const user = useContext(UserContext);

  return (
    <div className="queue">
      <div className="title">
        <h1>We are here to help, {user.displayName}</h1>
      </div>
      <div>
        <h2>Currently helping</h2>
        <ListGroup className="helping">
          {queue &&
            Object.values(queue)
              .filter((group) => group.currentlyHelping)
              .map((group) => (
                <ListGroup.Item key={group.id}>
                  <Group
                    names={group.names}
                    issue={group.issue}
                    time={group.time}
                    helper={group.helper}
                  />
                </ListGroup.Item>
              ))}
          {queue &&
            !Object.values(queue).some((group) => group.currentlyHelping) && (
              <div>
                <p>Not helping anyone</p>
              </div>
            )}
        </ListGroup>
      </div>
      <div>
        <h2>Upcoming</h2>
        <ListGroup className="upcoming">
          {queue &&
            Object.values(queue)
              .filter((group) => !group.currentlyHelping)
              .map((group) => (
                <ListGroup.Item key={group.id}>
                  <Group
                    names={group.names}
                    issue={group.issue}
                    time={group.time}
                    joined={group.joined}
                    helper={group.helper}
                  />
                  {!group.public &&
                    !group.names.some((object) => object.uid === user.uid) && (
                      <Button
                        className="private-btn"
                        variant="secondary"
                        disabled
                      >
                        Private
                      </Button>
                    )}
                  {group.public &&
                    !group.names.some((object) => object.uid === user.uid) && (
                      <Button
                        className="join-btn"
                        key={group.id}
                        onClick={() => joinQueue(studentData, group.id)}
                        variant="success"
                      >
                        Join
                      </Button>
                    )}
                  {group.names.some((object) => object.uid === user.uid) && (
                    <Button
                      className="leave-btn"
                      key={group.id}
                      onClick={() => leaveQueue(studentData, group.id)}
                      variant="danger"
                    >
                      Leave
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
          {queue &&
            !Object.values(queue).some((group) => !group.currentlyHelping) && (
              <div>
                <p>No groups in the queue</p>
              </div>
            )}
        </ListGroup>
      </div>
    </div>
  );
};

export default StudentQueue;
