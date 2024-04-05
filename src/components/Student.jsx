import StudentQueue from './StudentQueue.jsx';
import NewGroup from './NewGroup.jsx';
import './Student.css';

import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { createNewGroup, addToGroup, removeFromGroup} from '../DatabaseFuncs.mjs';
import { set } from 'firebase/database';
import { Button } from 'react-bootstrap';

const Student = ({queue, studentData}) => {
  const [refinedQueue, setRefinedQueue] = useState([]);
  const [modalShow, setModalShow] = useState(false); // State to track modal
  const [clientJoined, setClientJoined] = useState(false) // State to track if client clicked a join button
  const [joinedGroupId, setJoinedGroupId] = useState(null); // State to track the group id of a group the client joined

  useEffect(() => {
    // Checks if queue is defined
    if (queue) {
      // Format queue data
      const formattedQueue = queue.map((item) => {
        // Convert unix time to readable time
        const unixTimestamp = item.time;
        const date = new Date(unixTimestamp * 1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const formattedTime = isNaN(date.getTime()) ? "Invalid Time" : `${hours}:${minutes.substr(-2)}`;

        // Convert list of names to string
        const namesObjects = item["names"];
        const namesArray = Object.values(namesObjects).map((obj) => {return obj["name"]});
        const namesString = namesArray.join(", "); 

        // Add a joined field to each object
        const joined = item.id === joinedGroupId; // If joinedGroupId matches the item id, the client joined this group
        
        // Return a new object with formatted time and names
        return {
          ...item,
          time: formattedTime,
          names: namesString,
          joined: joined,
        };
      });

      // Update state
      setRefinedQueue(formattedQueue);
    }
  }, [queue]);

  const handleJoinQueue = (studentData, groupID) => {
    addToGroup(studentData.course, studentData.section, studentData.name, groupID);
    setClientJoined(true);
    setJoinedGroupId(groupID);
  };

  return (
    <div className="student_view">
      <div className="queue">
        <StudentQueue queue={refinedQueue} studentData={studentData} clientJoined={clientJoined} joinQueue={handleJoinQueue} />
      </div>
      <div className="new">
        <Button variant="dark" onClick={() => setModalShow(true)}>New Group</Button>
        {/* Bootstrap modal */}
        <NewGroup
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
    </div>

  );
};

export default Student;