import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const NewGroup = (props) => {
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
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>What type of help do you need?</Form.Label>
              <div key={`inline-radio`} className="mb-3">
                <Form.Check
                  inline
                  label="Conceptual"
                  name="group1"
                  type="radio"
                  id="inline-radio-1"
                />
                <Form.Check
                  inline
                  label="Debugging"
                  name="group1"
                  type="radio"
                  id="inline-radio-1"
                />
              </div>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>What do you need help with?</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger">
            Close
          </Button>
          <Button variant="dark">
            Submit
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default NewGroup;