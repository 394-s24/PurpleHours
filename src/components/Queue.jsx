// Queue.jsx
import { ListGroup, Button } from "react-bootstrap";
import Group from "./Group";
import "./Queue.css";

const Queue = ({
  queue,
  user,
  title,
  currentlyHelpingTitle,
  upcomingTitle,
  renderCurrentlyHelpingButton,
  renderUpcomingButton,
}) => {
  return (
    <div className="queue">
      <div className="title">
        <h1>
          {title}, {user.displayName}
        </h1>
      </div>
      <div>
        <h2>{currentlyHelpingTitle}</h2>
        <ListGroup className="helping">
          {queue &&
            Object.values(queue)
              .filter((group) => group.currentlyHelping)
              .sort((a, b) => {
                const aHelpCount = Object.values(a.names)[0]?.helpCount || 0;
                const bHelpCount = Object.values(b.names)[0]?.helpCount || 0;
                return aHelpCount - bHelpCount;
              })
              .map((group) => (
                <ListGroup.Item key={group.id}>
                  <Group
                    names={group.names}
                    issue={group.issue}
                    time={group.time}
                    online={group.online}
                    helper={group.helper}
                  />
                  {renderCurrentlyHelpingButton(group)}
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
        <h2>{upcomingTitle}</h2>
        <ListGroup className="upcoming">
          {queue &&
            Object.values(queue)
              .filter((group) => !group.currentlyHelping)
              .sort((a, b) => {
                const aHelpCount = Object.values(a.names)[0]?.helpCount || 0;
                const bHelpCount = Object.values(b.names)[0]?.helpCount || 0;
                return aHelpCount - bHelpCount;
              })
              .map((group) => (
                <ListGroup.Item key={group.id}>
                  <Group
                    names={group.names}
                    issue={group.issue}
                    time={group.time}
                    online={group.online}
                    helper={group.helper}
                  />
                  {renderUpcomingButton(group)}
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

export default Queue;
