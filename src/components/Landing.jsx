import { useState } from 'react';
import { Button } from 'react-bootstrap';
import StudentModal from './StudentModal.jsx';
import TAModal from './TAModal.jsx';
import { signInWithGoogle, firebaseSignOut, useAuthState } from '../DatabaseFuncs.mjs';
import './Landing.css';

const SignInButton = () => (
  <div className="btns">
    <button className="ms-auto btn btn-dark" onClick={signInWithGoogle}>Sign in</button>
  </div>
);

const SignOutButton = () => (
  <button className="ms-auto btn btn-dark" onClick={firebaseSignOut}>Sign out</button>
);

const Landing = (props) => {
  const [studentModalShow, setStudentModalShow] = useState(false);
  const [TAModalShow, setTAModalShow] = useState(false);
  const [user] = useAuthState();

  const JoinButtons = () => (
    <div className="btns">
      <Button variant="dark" onClick={() => setStudentModalShow(true)}>
        I am a Student
      </Button>
      <Button variant="dark" onClick={() => setTAModalShow(true)}>
        I am a TA/PM
      </Button>
      <SignOutButton />
      <StudentModal show={studentModalShow} onHide={() => setStudentModalShow(false)} setStudentData={props.setStudentData} setDbArgs={props.setDbArgs} />
      <TAModal show={TAModalShow} onHide={() => setTAModalShow(false)} setDbArgs={props.setDbArgs} />
    </div>
  );

  return (
    <div className="landing">
      <div className="title">
        <h1>Purple Hours</h1>
      </div>
      {user ? <JoinButtons /> : <SignInButton />}
    </div>
  );
};

export default Landing;
