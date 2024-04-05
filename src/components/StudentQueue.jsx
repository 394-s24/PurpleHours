import Group from './Group';
import './Queue.css';
import { ListGroup, Card, Button } from 'react-bootstrap';

// The Queue component
const StudentQueue = ({ queue , clientJoined, joinQueue}) => {
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
                joined={group.joined}
              />
              {!clientJoined && <Button className="join-btn" key={group.id} onClick={() => joinQueue(group.id)} variant="success" >Join</Button>}
              {group.joined && <Button className="leave-btn" key={group.id} variant="danger">Leave</Button>}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default StudentQueue;
