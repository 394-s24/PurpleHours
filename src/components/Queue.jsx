// Queue.jsx
import { ListGroup } from "react-bootstrap";

import Group from "./Group";
import "./Queue.css";

const Queue = ({
  queue,
  currentlyHelpingTitle,
  upcomingTitle,
  renderCurrentlyHelpingButton,
  renderUpcomingButton,
  loadingGroup,
  course,
}) => {

  return (
    <div className="queue">
      <div className="title">
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
                if (aHelpCount !== bHelpCount) {
                  return aHelpCount - bHelpCount;
                }
                return a.originalTime - b.originalTime;
              })
              .map((group) => (
                <ListGroup.Item key={group.id}>
                  <Group
                    names={group.names}
                    issue={group.issue}
                    time={group.time}
                    online={group.online}
                    helper={group.helper}
                    loading={loadingGroup === group.id}
                    course={course}
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
                // Primary sorting by help count
                if (aHelpCount !== bHelpCount) {
                  return aHelpCount - bHelpCount;
                }
                // Secondary sorting by originalTime if help counts are the same
                return a.originalTime - b.originalTime;
              })
              .map((group) => (
                <ListGroup.Item key={`upcoming-group-${group.id}`}>
                  <Group
                    names={group.names}
                    issue={group.issue}
                    time={group.time}
                    online={group.online}
                    helper={group.helper}
                    loading={loadingGroup === group.id}
                    course={course}
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
