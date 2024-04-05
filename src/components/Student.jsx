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
  const [nameID, setNameID] = useState(null);
  const [modalShow, setModalShow] = useState(false); // State to track modal
  const [clientJoined, setClientJoined] = useState(false) // State to track if client clicked a join button
  const [joinedGroupId, setJoinedGroupId] = useState(null); // State to track the group id of a group the client joined

  const renderQueue = () => {
    // Checks if queue is defined
    console.log(queue);
    if (queue) {
      // Format queue data
      const formattedQueue = Object.values(queue).map((item) => {
        // Convert unix time to readable time
        const unixTimestamp = item.time;
        const date = new Date(unixTimestamp * 1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const formattedTime = isNaN(date.getTime()) ? "Invalid Time" : `${hours}:${minutes.substr(-2)}`;

        // Convert list of names to string
        const namesObjects = item["names"];
        let namesArray = ["No members"];
        if (namesObjects) {
          namesArray = Object.values(namesObjects).map((obj) => {return obj["name"]});
        }
        const namesString = namesArray.join(", "); 
        
        // Return a new object with formatted time and names
        return {
          ...item,
          time: formattedTime,
          names: namesString,
        };
      });

      // Update state
      setRefinedQueue(formattedQueue);
    }
  };

  useEffect(renderQueue, [queue]);

  const handleJoinQueue = async (studentData, groupID) => {
    setClientJoined(true);
    setJoinedGroupId(groupID);
    setNameID(await addToGroup(studentData.course, studentData.session, studentData.name, groupID));
  };

  const handleLeaveQueue = (studentData, groupID) => {
    setClientJoined(false);
    setJoinedGroupId(null);
    setNameID(null);
    removeFromGroup(studentData.course, studentData.session, nameID, groupID);
  };

  const onFormSubmit = (groupID, nameID) => {
    setClientJoined(true);
    setJoinedGroupId(groupID);
    setNameID(nameID);
  }

  return (
    <div className="student_view">
      <div className="queue">
        <StudentQueue
          queue={refinedQueue}
          studentData={studentData}
          clientJoined={clientJoined}
          joinedID = {joinedGroupId}
          joinQueue={handleJoinQueue}
          leaveQueue={handleLeaveQueue} />
      </div>
      <div className="new">
        <Button variant="dark" onClick={() => setModalShow(true)}>New Group</Button>
        {/* Bootstrap modal */}
        <NewGroup
          studentData={studentData}
          show={modalShow}
          onFormSubmit={onFormSubmit}
          onHide={() => setModalShow(false)}
        />
      </div>
    </div>

  );
};

export default Student;