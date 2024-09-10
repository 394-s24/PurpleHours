import { useEffect, useState } from "react";
import { isUserTA } from "../../server/database/UserFuncs.js";

const useTaValidation = (user, course, navigate) => {
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const validateTA = async () => {
      const result = await isUserTA(user.uid, course);
      if (!result) {
        navigate("/invalid-ta")
      }
      setValidating(false);
    };
    validateTA();
  });

  return [validating, !validating];
};


export default useTaValidation;
