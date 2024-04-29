import { useState, useContext } from "react";
import { Button, Modal, Form } from "react-bootstrap";

import { addToGroup, createNewGroup } from "../DatabaseFuncs.mjs";
import UserContext from "../UserContext";

const NewGroup = ({ studentData, ...props }) => {
  const [helpType, setHelpType] = useState("");
  const [helpDescription, setHelpDescription] = useState("");
  const [helpPublic, setHelpPublic] = useState(true);
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
    // setHelpPublic(e.target.value);
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
      };
      // Pass the data to an external function
      let groupID = await createNewGroup(studentData.course, groupsData);
      await addToGroup(studentData.course, groupID, user.displayName, user.uid);
      props.onHide();
      // setupUserPresence(studentData.course, id, groupID);
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
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="helpType">
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
          <Form.Group className="mb-3" controlId="helpDescription">
            <Form.Label>What do you need help with?</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={3}
              name="helpDescription"
              onChange={handleHelpDescriptionChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a detailed description of the problem
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" variant="outline-light">
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default NewGroup;
