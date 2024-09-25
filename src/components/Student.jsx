import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import {
  addToGroup,
  removeFromGroup,
} from "../../server/database/GroupFuncs.js";
import { useDbData } from "../../server/database/DataHooks.js";

import useQueueManager from "../utils/useQueueManager";
import useGroupStatus from "../utils/useGroupStatus";
import useCourseValidation from "../utils/useCourseValidation";
import SignInOutButton from "./SignInOutButton";
import StudentQueue from "./StudentQueue";
import NewGroup from "./NewGroup";
import LoadingScreen from "./LoadingScreen.jsx";
import useInitializeUser from "../utils/useInitializeUser.js";

import "./Student.css";

const Student = () => {
  const { course } = useParams();
  const navigate = useNavigate();

  const [validating, isValid] = useCourseValidation(course, navigate);
  const [loggedIn, setLoggedIn] = useState(false);

  // Fetch queue data and user info with real-time updates
  const [queue, error] = useDbData(course);
  const refinedQueue = useQueueManager(queue, course);

  const user = useInitializeUser(course, isValid, setLoggedIn);
  const [inGroup, setInGroup] = useGroupStatus(course, user);

  const [modalShow, setModalShow] = useState(false);

  const handleJoinQueue = async (course, groupId) => {
    await addToGroup(course, groupId, user.displayName, user.uid);
    setInGroup(true);
  };

  const handleLeaveQueue = async (course, groupId) => {
    await removeFromGroup(course, user.uid, groupId);
    setInGroup(false);
  };

  return (
    <div className="student_view">
      {validating && <LoadingScreen />}
      {isValid && <div className="title">
        <h1>{course.toUpperCase()} Office Hours</h1>
        <SignInOutButton loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      </div>}
      {loggedIn && (
        <>
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
                Join Queue
              </Button>
            )}
            <NewGroup
              course={course}
              show={modalShow}
              onHide={() => setModalShow(false)}
              setInGroup={setInGroup}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Student;
