import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import useQueueManager from "../utils/useQueueManager";
import StudentQueue from "./StudentQueue";
import NewGroup from "./NewGroup";
import { addToGroup, removeFromGroup, useDbData } from "../database/DatabaseFuncs.js";
import "./Student.css";

const Student = ({ studentData }) => {

  const course = "cs211"

  const [queue, error] = useDbData(course)

  const { refinedQueue, user, handleBack } = useQueueManager(
    queue,
    studentData,
  ); 

  const [modalShow, setModalShow] = useState(false);

  const handleJoinQueue = async (course, groupId) => {
    addToGroup(course, groupId, user.displayName, user.uid);
  };

  const handleLeaveQueue = (course, groupID) => {
    removeFromGroup(course, user.uid, groupID);
  };

  return (
    <div className="student_view">
      <Button
        className="go_back_btn"
        variant="outline-light"
        onClick={() => handleBack()}
      >
        Go Back
      </Button>
      <StudentQueue
        queue={refinedQueue}
        course={course}
        joinQueue={handleJoinQueue}
        leaveQueue={handleLeaveQueue}
      />
      <div className="new">
        <Button variant="outline-light" onClick={() => setModalShow(true)}>
          New Group
        </Button>
        <NewGroup
          course={course}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
    </div>
  );
};

export default Student;
