import { useEffect, useState } from "react";
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

import "./Student.css";

const Student = () => {
  const { course } = useParams();
  const navigate = useNavigate();

  // Course validation state
  const [validating, isValid] = useCourseValidation(course, navigate);

  // Loading and data fetching states
  const [loggedIn, setLoggedIn] = useState(false);

  // Fetch queue data and user info
  const [queue, error] = useDbData(course);
  const { refinedQueue, user } = useQueueManager(queue, course);

  // User group status state
  const [inGroup, setInGroup] = useGroupStatus(course, user);

  // New Group modal state
  const [modalShow, setModalShow] = useState(false);

  // Handle loading state after data fetch
  useEffect(() => {
    if (user && queue) {
      setLoggedIn(true);
    }
  }, [user, queue]);

  // Handle group join and leave logic
  const handleJoinQueue = async (course, groupId) => {
    await addToGroup(course, groupId, user.displayName, user.uid);
    setInGroup(true);
  };

  const handleLeaveQueue = async (course, groupId) => {
    await removeFromGroup(course, user.uid, groupId);
    setInGroup(false);
  };

  // Component JSX rendering
  return (
    <div className="student_view">
      {validating && <LoadingScreen />}
      <div className="title">
        <h1>{course.toUpperCase()} Office Hours</h1>
        <SignInOutButton loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      </div>
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
              <Button
                variant="outline-light"
                onClick={() => setModalShow(true)}
              >
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
        </>
      )}
    </div>
  );
};

export default Student;
