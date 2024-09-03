import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import {
  addToGroup,
  removeFromGroup,
} from "../../server/database/GroupFuncs.js";
import { isUserInGroup } from "../../server/database/UserFuncs.js";
import { useDbData } from "../../server/database/DataHooks.js";

import useQueueManager from "../utils/useQueueManager";
import StudentQueue from "./StudentQueue";
import NewGroup from "./NewGroup";

import "./Student.css";

const Student = ({ studentData }) => {
  const course = "cs211";

  const [queue, error] = useDbData(course);

  const { refinedQueue, user, handleBack } = useQueueManager(
    queue,
    studentData,
  );

  const [inGroup, setInGroup] = useState(false);

  useEffect(() => {
    const checkUserGroupStatus = async () => {
      const inGroupStatus = await isUserInGroup(user.uid);
      setInGroup(inGroupStatus);
    };

    checkUserGroupStatus();
  }, [queue, user.uid]);

  const [modalShow, setModalShow] = useState(false);

  const handleJoinQueue = async (course, groupId) => {
    await addToGroup(course, groupId, user.displayName, user.uid);
    const inGroupStatus = await isUserInGroup(user.uid);
    setInGroup(inGroupStatus);
  };

  const handleLeaveQueue = async (course, groupID) => {
    await removeFromGroup(course, user.uid, groupID);
    const inGroupStatus = await isUserInGroup(user.uid);
    setInGroup(inGroupStatus);
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
        inGroup={inGroup}
      />
      <div className="new">
        {!inGroup && (
          <Button variant="outline-light" onClick={() => setModalShow(true)}>
            New Group
          </Button>
        )}
        <NewGroup
          course={course}
          show={modalShow}
          onHide={() => setModalShow(false)}
          setInGroup={setInGroup}
        />
      </div>
    </div>
  );
};

export default Student;
