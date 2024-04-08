import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StudentModal from './StudentModal';
import TAModal from './TAModal';
import './index.css';

const Landing = (props) => {
  const [studentModalShow, setStudentModalShow] = useState(false);
  const [TAModalShow, setTAModalShow] = useState(false);

  return (
    <div className="landing">
      <div className="title">
        <h1>Purple Hours</h1>
      </div>
      <div className="btns">
        <Button variant="dark" onClick={() => setStudentModalShow(true)}>
          I am a Student
        </Button>
        <Button variant="dark" onClick={() => setTAModalShow(true)}>
          I am a TA/PM
        </Button>
        <StudentModal
          show={studentModalShow}
          onHide={() => setStudentModalShow(false)}
          setStudentData={props.setStudentData}
          setDbArgs={props.setDbArgs}
        />
        <TAModal
          show={TAModalShow}
          onHide={() => setTAModalShow(false)}
          setDbArgs={props.setDbArgs}
        />
      </div>
    </div>
  );
};

export default Landing;
