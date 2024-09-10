import { useEffect, useState } from "react";
import { isValidCourse } from "../../server/database/CourseFuncs.js";

const useCourseValidation = (course, navigate) => {
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const validateCourse = async () => {
      const result = await isValidCourse(course);
      if (!result) {
        navigate("/404");
      }
      setValidating(false);
    };
    validateCourse();
  }, [course, navigate]);

  return [validating, !validating];
};

export default useCourseValidation;
