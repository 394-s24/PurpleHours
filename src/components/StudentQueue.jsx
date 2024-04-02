import Group from './Group';
import './Queue.css';
import { ListGroup, Card, Button } from 'react-bootstrap';

// The Queue component
const StudentQueue = ({ queue , handleQueue}) => {
  const first = queue ? queue[0] : null;
  const rest = queue.slice(1);
  return (
    <div className="queue">
      <div>
        <h2>Currently helping</h2>
        <Card body className="helping">
          {first && (
            <Group names={first.names} issue={first.issue} time={first.time} />
          )}
        </Card>
      </div>
      <div>
        <h2>Upcoming</h2>
        <ListGroup className="upcoming">
          {rest.map((group, index) => (
            <ListGroup.Item key={index}>
              <Group
                key={index}
                names={group.names}
                issue={group.issue}
                time={group.time}
              />
              <Button key={group.id} onClick={() => handleQueue(group.id)} variant="primary" >Join</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default StudentQueue;
