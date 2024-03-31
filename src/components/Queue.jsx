import Group from './Group';
import './Queue.css';
import { ListGroup, Button } from 'react-bootstrap';

// The Queue component
const Queue = ({ queue }) => {
  const first = queue ? queue[0] : null;
  const rest = queue.slice(1);
  return (
    <div className="queue">
      <div>
        <h2>Currently helping</h2>
        {first && (
          <Group name={first.name} issue={first.issue} time={first.time} />
        )}
      </div>
      <div>
        <h2>Upcoming</h2>
        <ListGroup>
          {rest.map((group, index) => (
            <ListGroup.Item>
              <Group
                key={index}
                name={group.name}
                issue={group.issue}
                time={group.time}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default Queue;
