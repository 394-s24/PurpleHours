// import React from 'react';
// import Group from './Group';
// import './Queue.css';
// import "bootstrap/dist/css/bootstrap.min.css";
// import {ListGroup, Button } from 'react-bootstrap';

// // The Queue component
// const Queue = ({ queue }) => {
//     return (
//       <div className="queue">
//         {queue.map((group, index) => (
//           <Group
//             key={index}
//             name={group.name}
//             issue={group.issue}
//             time={group.time}
//           />
//         ))}
//       </div>
//     );
// };

import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import './Queue.css'; // Your custom CSS

const Queue = () => (
  <div className="queue-container">
    <h2>Dave's 211 Queue</h2>
    <ListGroup>
      {/* Currently Helping */}
      <ListGroup.Item className="currently-helping">
        Ella - My code doesn't work
        <span className="time">1:27 PM</span>
      </ListGroup.Item>
      
      {/* Upcoming */}
      <ListGroup.Item variant="secondary">Steven - Debugging - BFS <span className="time">1:32 PM</span></ListGroup.Item>
      <ListGroup.Item variant="info">Gus - Conceptual - Don't know how to start assign. <span className="time">1:44 PM</span></ListGroup.Item>
      {/* ... other items */}
    </ListGroup>
    <Button variant="danger" className="end-session-btn">End Session</Button>
  </div>
);


export default Queue;