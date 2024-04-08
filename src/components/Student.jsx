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
  const [nameID, setNameID] = useState([]);
  const [modalShow, setModalShow] = useState(false); // State to track modal
  const [clientJoined, setClientJoined] = useState(false) // State to track if client clicked a join button
  const [joinedGroupId, setJoinedGroupId] = useState([]); // State to track the group id of a group the client joined

  const renderQueue = () => {
    // Checks if queue is defined
    // console.log(queue);
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
    // setJoinedGroupId(joinedGroupId.concat([groupID]));
    setJoinedGroupId([...joinedGroupId, groupID]);
    let id = await addToGroup(studentData.course, studentData.session, studentData.name, groupID)
    setNameID([...nameID, id]);
  };

  const handleLeaveQueue = (studentData, groupID) => {
    setClientJoined(false);
    setJoinedGroupId(joinedGroupId.toSpliced(joinedGroupId.indexOf(groupID), 1));
    removeFromGroup(studentData.course, studentData.session, nameID[joinedGroupId.indexOf(groupID)], groupID);
    setNameID(nameID.toSpliced(joinedGroupId.indexOf(groupID), 1));
  };

  const onFormSubmit = async (groupID, nameID) => {
    // setClientJoined(true);
    // // setJoinedGroupId(joinedGroupId.concat([groupID]));
    // setJoinedGroupId([...joinedGroupId, groupID]);
    // let id = await addToGroup(studentData.course, studentData.session, studentData.name, groupID)
    // setNameID([...nameID, id]);
    console.log("hello");
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
          nameID={nameID}
          setNameID={setNameID}
          joinedGroupId={joinedGroupId}
          setJoinedGroupId={setJoinedGroupId}
          onFormSubmit={onFormSubmit}
          onHide={() => setModalShow(false)}
        />
      </div>
    </div>

  );
};

export default Student;