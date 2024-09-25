import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

import {
  setGroupHelping,
  removeGroupAndIncrement,
  putBackGroup,
} from "../../server/database/GroupFuncs.js";
import { clearQueue } from "../../server/database/QueueFuncs.js";
import { useDbData } from "../../server/database/DataHooks.js";

import useQueueManager from "../utils/useQueueManager";
import useCourseValidation from "../utils/useCourseValidation";
import useTAValidation from "../utils/useTAValidation";
import SignInOutButton from "./SignInOutButton";
import TAQueue from "./TAQueue";
import LoadingScreen from "./LoadingScreen.jsx";
import useInitializeUser from "../utils/useInitializeUser.js";

import "./TA.css";

const TA = () => {
  // Get course id
  const { course } = useParams();

  const navigate = useNavigate();
  // Course validation state
  const [validating, isValid] = useCourseValidation(course, navigate);

  // Loading and data fetching states
  const [loggedIn, setLoggedIn] = useState(false);

  // Fetch queue data and user info
  const [queue, error] = useDbData(course);
  const refinedQueue = useQueueManager(queue, course);

  // Initialize user
  const user = useInitializeUser(course, isValid, setLoggedIn);

  // TA validation state
  // States not being used since we're redirecting to an error page
  useTAValidation(user, course, navigate);

  // Modal state for confirming queue clearance
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle group actions (Done, Helping, Put Back)
  const handleDone = (groupId) => {
    removeGroupAndIncrement(course, groupId);
  };

  const handleHelping = (groupId) => {
    setGroupHelping(course, groupId, user);
  };

  const handlePutBack = (groupId) => {
    putBackGroup(course, groupId);
  };

  // Handle queue clearance
  const handleClearQueue = () => {
    clearQueue();
    setShowConfirm(false); // Close the modal after clearing the queue
  };

  // Show the confirmation modal
  const handleShowConfirm = () => {
    setShowConfirm(true);
  };

  // Hide the confirmation modal
  const handleCancel = () => {
    setShowConfirm(false);
  };

  // Render the component
  return (
    <div className="ta_view">
      {validating && <LoadingScreen />}
      {isValid && <div className="title">
        <h1>{course.toUpperCase()} Office Hours</h1>
        <SignInOutButton loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      </div>}
      {loggedIn && (
        <>
          <TAQueue
            queue={refinedQueue}
            handleDone={handleDone}
            handleHelping={handleHelping}
            handlePutBack={handlePutBack}
            course={course}
          />
          <div className="clear">
            <Button
              className="clear_btn"
              variant="danger"
              onClick={handleShowConfirm}
            >
              Clear Queue
            </Button>
          </div>
          <Modal show={showConfirm} onHide={handleCancel}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Clear Queue</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to clear the entire queue? This action
              cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleClearQueue}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default TA;
