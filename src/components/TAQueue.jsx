import Group from "./Group";
import "./Queue.css";
import { ListGroup, Button } from "react-bootstrap";

// The Queue component
const TAQueue = ({ queue, handleDone, handleHelping }) => {
  return (
    <div className="queue">
      <div>
        <h2>Currently helping</h2>
        <ListGroup className="helping">
          {queue && Object.values(queue)
            .filter((group) => group.currentlyHelping)
            .map((group) => (
              <ListGroup.Item key={group.id}>
                <Group
                  names={group.names}
                  issue={group.issue}
                  time={group.time}
                />
                <Button
                  className="done-btn"
                  onClick={() => handleDone(group.id)}
                  variant="success"
                >
                  Done
                </Button>
              </ListGroup.Item>
            ))}
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
                />
                <Button
                  className="help-btn"
                  onClick={() => handleHelping(group.id)}
                  variant="success"
                >
                  Help
                </Button>
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

export default TAQueue;
