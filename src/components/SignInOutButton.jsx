import {
  signInWithGoogle,
  firebaseSignOut,
} from "../../server/database/AuthFuncs.js";

const SignInOutButton = ({ loggedIn, setLoggedIn }) => {
  const SignInButton = () => (
    <div className="btns">
      <button
        className="ms-auto btn btn-outline-light"
        onClick={signInWithGoogle}
      >
        Sign in
      </button>
    </div>
  );

  const SignOutButton = () => (
    <button className="ms-auto btn btn-outline-light" onClick={handleSignOut}>
      Sign out
    </button>
  );

  const handleSignOut = () => {
    firebaseSignOut();
    setLoggedIn(false);
  };

  return <div>{!loggedIn ? <SignInButton /> : <SignOutButton />}</div>;
};

export default SignInOutButton;
