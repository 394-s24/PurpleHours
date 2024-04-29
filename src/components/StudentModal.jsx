import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const StudentModal = ({setStudentData, setDbArgs, onHide, ...props}) => {
  const [course, setCourse] = useState("");
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
  };

  // Set student data and db args and navigate to student page
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setStudentData({
        course: course,
      });
      setDbArgs(course);
      onHide();

      navigate("/student");
    }

    setValidated(true);
  };

  return (
    <div className="modal-body">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Join Office Hours
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Select
              aria-label="Default select example"
              required
              onChange={handleCourseChange}
            >
              <option value="" defaultValue>
                Select a course
              </option>
              <option value="cs211">CS 211</option>
              {/* <option value="213">CS 213</option>
                        <option value="214">CS 214</option> */}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select a class.
            </Form.Control.Feedback>
            <br />
            <Button variant="outline-light" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentModal;
