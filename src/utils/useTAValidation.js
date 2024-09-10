import { useEffect, useState } from "react";
import { isUserTA } from "../../server/database/UserFuncs.js";

const useTAValidation = (user, course, navigate) => {
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const validateTA = async () => {
      if (!user || !user.uid) {
        setValidating(false);
        return;
      }

      const result = await isUserTA(user.uid, course);
      if (!result) {
        navigate("/invalid-ta");
      }
      setValidating(false);
    };

    // Only run validation if user and course are defined
    if (user && course) {
      validateTA();
    }
  }, [user, course, navigate]); // Add user, course, and navigate as dependencies

  return [validating, !validating];
};

export default useTAValidation;
