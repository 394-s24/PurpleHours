import Group from './Group';
import './Queue.css';
import { ListGroup, Card, Button } from 'react-bootstrap';

// The Queue component
const StudentQueue = ({ queue , studentData, clientJoined, joinedID, joinQueue, leaveQueue}) => {

  return (
    <div className="queue">
      <div className="title">
        <h1>We are here to help, {studentData.name}</h1>
      </div>
      <div>
        <h2>Currently helping</h2>
        <ListGroup className="helping">
          {Object.values(queue).filter(group => group.currentlyHelping).map(group => (
            <ListGroup.Item key={group.id}>
              <Group names={group.names} issue={group.issue} time={group.time} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <div>
        <h2>Upcoming</h2>
        <ListGroup className="upcoming">
          {Object.values(queue).filter(group => !group.currentlyHelping).map((group) => (
            <ListGroup.Item key={group.id}>
              <Group
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
