import Group from './Group';
import './Queue.css';
import { ListGroup, Card, Button } from 'react-bootstrap';

// The Queue component
const StudentQueue = ({ queue , studentData, clientJoined, joinedID, joinQueue, leaveQueue}) => {
  const first = queue ? queue[0] : null;
  const rest = queue.slice(1);
  return (
    <div className="queue">
      <div className="title">
        <h1>We are here to help, {studentData.name}</h1>
      </div>
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
          {Object.values(rest).map((group, index) => (
            <ListGroup.Item key={index}>
              <Group
                key={index}
                names={group.names}
                issue={group.issue}
                time={group.time}
                joined={group.joined}
              />
              {!(joinedID.includes(group.id)) && <Button className="join-btn" key={group.id} onClick={() => joinQueue(studentData, group.id)} variant="success" >Join</Button>}
              {joinedID.includes(group.id) && <Button className="leave-btn" key={group.id} onClick={() => leaveQueue(studentData, group.id)} variant="danger">Leave</Button>}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default StudentQueue;
