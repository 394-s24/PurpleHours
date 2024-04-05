import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

import { addToGroup, createNewGroup } from '../DatabaseFuncs.mjs';

const NewGroup = (props, studentData) => {
  const [helpType, setHelpType] = '';
  const [helpDescription, setHelpDescription] = '';

  const handleHelpTypeChange = (e) => {
    setHelpType(e.target.id);
  };

  const handleHelpDescriptionChange = (e) => {
    setHelpDescription(e.target.value);
  };
  
  const handleSubmit = async () => {
    // Construct the JSON object from the state
    const groupsData = {
      issue: `${helpType}: ${helpDescription}`,
      time : Math.floor(Date.now() / 1000),
      done : false,
      public : true
    };

    // Pass the data to an external function
    let groupKey = await createNewGroup(studentData.course, studentData.session, groupsData);
    return await addToGroup(studentData.course, studentData.session, studentData.name, groupKey);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          New Group
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form>
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
            <Form.Group
              className="mb-3"
              controlId="helpDescription"
            >
              <Form.Label>What do you need help with?</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                name="helpDescription"
                value={helpDescription}
                onChange={setHelpDescription}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="dark"
            onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default NewGroup;