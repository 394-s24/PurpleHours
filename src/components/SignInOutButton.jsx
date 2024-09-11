import { Button } from "react-bootstrap";

import {
  signInWithGoogle,
  firebaseSignOut,
} from "../../server/database/AuthFuncs.js";

const SignInOutButton = ({ loggedIn, setLoggedIn }) => {
  const SignInButton = () => (
    <div className="btns">
      <Button variant="outline-light" onClick={signInWithGoogle}>Sign In</Button>
    </div>
  );

  const SignOutButton = () => (
    <Button variant="outline-light" onClick={handleSignOut}>Sign Out</Button>
  );

  const handleSignOut = () => {
    firebaseSignOut();
    setLoggedIn(false);
  };

  return <div>{!loggedIn ? <SignInButton /> : <SignOutButton />}</div>;
};

export default SignInOutButton;
