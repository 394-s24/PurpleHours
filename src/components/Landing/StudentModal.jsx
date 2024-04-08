import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

const StudentModal = (props) => {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');

  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
  };

  // Set student data and db args and navigate to student page
  const handleSubmit = () => {
    props.setStudentData({
      name: name,
      course: course,
      session: 'favouroh1', // Hardocded session for now
    });
    props.setDbArgs([course, 'favouroh1']);
    props.onHide();

    navigate('/student');
  };

  return (
    <div className="modal-body">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Join Office Hours
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="string"
                placeholder="John Doe"
                autoFocus
                onChange={handleNameChange}
              />
            </Form.Group>
            <Form.Label>Course</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={handleCourseChange}
            >
              <option>Select a course</option>
              <option value="cs211">CS 211</option>
              {/* <option value="213">CS 213</option>
                        <option value="214">CS 214</option> */}
            </Form.Select>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentModal;
