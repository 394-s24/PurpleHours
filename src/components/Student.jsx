import { Button } from "react-bootstrap";
import { useState } from "react";
import useQueueManager from "../utils/useQueueManager";
import StudentQueue from "./StudentQueue";
import NewGroup from "./NewGroup";
import { addToGroup, removeFromGroup } from "../database/DatabaseFuncs.js";
import "./Student.css";

const Student = ({ queue, studentData }) => {
  const { refinedQueue, user, handleBack } = useQueueManager(
    queue,
    studentData,
  );
  const [modalShow, setModalShow] = useState(false);

  const handleJoinQueue = async (studentData, groupId) => {
    await addToGroup(studentData.course, groupId, user.displayName, user.uid);
  };

  const handleLeaveQueue = (studentData, groupID) => {
    removeFromGroup(studentData.course, user.uid, groupID);
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
        studentData={studentData}
        joinQueue={handleJoinQueue}
        leaveQueue={handleLeaveQueue}
      />
      <div className="new">
        <Button variant="outline-light" onClick={() => setModalShow(true)}>
          New Group
        </Button>
        <NewGroup
          studentData={studentData}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
    </div>
  );
};

export default Student;
