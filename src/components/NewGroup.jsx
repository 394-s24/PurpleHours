import { useState, useContext } from "react";
import { Button, Modal, Form } from "react-bootstrap";

import {
  addToGroup,
  createNewGroup,
} from "../../server/database/GroupFuncs.js";
import { isUserInGroup } from "../../server/database/UserFuncs.js";

import UserContext from "./UserContext.jsx";

const NewGroup = ({ course, setInGroup, ...props }) => {
  const [helpType, setHelpType] = useState("Conceptual");
  const [helpDescription, setHelpDescription] = useState("");
  const [helpPublic, setHelpPublic] = useState(true);
  const [online, setOnline] = useState(false);
  const [validated, setValidated] = useState(false);
  const user = useContext(UserContext);

  const handleHelpTypeChange = (e) => {
    setHelpType(e.target.id);
  };

  const handleHelpDescriptionChange = (e) => {
    setHelpDescription(e.target.value);
  };

  const handleHelpPublicChange = (e) => {
    if (e.target.id === "Public") {
      setHelpPublic(true);
    } else {
      setHelpPublic(false);
    }
  };

  const handleOnlineChange = (e) => {
    if (e.target.id === "Online") {
      setOnline(true);
    } else {
      setOnline(false);
    }
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      const groupsData = {
        issue: `${helpType}: ${helpDescription}`,
        time: Math.floor(Date.now() / 1000),
        currentlyHelping: false,
        public: helpPublic,
        online: online,
      };
      // Pass the data to an external function
      let groupID = await createNewGroup(course, groupsData);
      await addToGroup(course, groupID, user.displayName, user.uid);

      // update inGroup value
      const inGroup = await isUserInGroup(user.uid, course);
      setInGroup(inGroup);

      props.onHide();
      setValidated(false);
    } else {
      setValidated(true);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">New Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          id="new-group-form"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Form.Group className="mb-3" controlId="helpPublic">
            <Form.Label>Do you want it to be a private OH?</Form.Label>
            <div key={`inline-radio`} className="mb-3">
              <Form.Check
                inline
                label="Public"
                value={true}
                name="helpPublic"
                type="radio"
                id="Public"
                onChange={handleHelpPublicChange}
                defaultChecked={true}
              />
              <Form.Check
                inline
                label="Private"
                value={false}
                name="helpPublic"
                type="radio"
                id="Private"
                onChange={handleHelpPublicChange}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="helpType">
            <Form.Label>What type of help do you need?</Form.Label>
            <div key={`inline-radio`} className="mb-3">
              <Form.Check
                inline
                label="Conceptual"
                name="helpType"
                type="radio"
                id="Conceptual"
                onChange={handleHelpTypeChange}
                defaultChecked={true}
              />
              <Form.Check
                inline
                label="Debugging"
                name="helpType"
                type="radio"
                id="Debugging"
                onChange={handleHelpTypeChange}
              />
              <Form.Check
                inline
                label="Other"
                name="helpType"
                type="radio"
                id="Other"
                onChange={handleHelpTypeChange}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="online">
            <Form.Label>Are you in-person or online?</Form.Label>
            <div key={`inline-radio`} className="mb-3">
              <Form.Check
                inline
                label="In-Person"
                value={false}
                name="online"
                type="radio"
                id="In-Person"
                onChange={handleOnlineChange}
                defaultChecked={true}
              />
              <Form.Check
                inline
                label="Online"
                value={true}
                name="online"
                type="radio"
                id="Online"
                onChange={handleOnlineChange}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="helpDescription">
            <Form.Label>What do you need help with?</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={3}
              name="helpDescription"
              onChange={handleHelpDescriptionChange}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              Please enter a detailed description of the problem
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="new-group-form" variant="outline-light">
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewGroup;
