import { Button, Modal } from "react-bootstrap";
import { useState } from "react";

import {
  setGroupHelping,
  removeGroupAndIncrement,
  putBackGroup,
} from "../../server/database/GroupFuncs.js";

import { clearQueue } from "../../server/database/QueueFuncs.js";

import { useDbData } from "../../server/database/DataHooks.js";

import useQueueManager from "../utils/useQueueManager";
import TAQueue from "./TAQueue";
import "./TA.css";

const TA = () => {
  const course = "cs211";

  const [queue, error] = useDbData(course);
  const { refinedQueue, user, handleBack } = useQueueManager(queue, course);

  // State to manage the visibility of the confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDone = (groupId) => {
    // Remove the group from the database
    removeGroupAndIncrement(course, groupId);
  };

  const handleHelping = (groupId) => {
    setGroupHelping(course, groupId, user);
  };

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

  const handlePutBack = (groupId) => {
    // Add a function to put back a group in the queue
    putBackGroup(course, groupId);
  }

  return (
    <div className="ta_view">
      <TAQueue
        queue={refinedQueue}
        handleDone={handleDone}
        handleHelping={handleHelping}
        handlePutBack={handlePutBack}
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
          Are you sure you want to clear the entire queue? This action cannot be undone.
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
    </div>
  );
};

export default TA;
