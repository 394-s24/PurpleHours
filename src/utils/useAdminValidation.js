import { useEffect, useState } from "react";
import { isUserAdmin } from "../../server/database/UserFuncs"; // Function to check if user is an admin

const useAdminValidation = (user, navigate) => {
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const validateAdmin = async () => {
      if (!user || !user.uid) {
        setValidating(false);
        return;
      }

      const result = await isUserAdmin(user.uid); // Check if the user is an admin
      if (!result) {
        navigate("/not-authorized"); // Redirect to an error page if not admin
      }
      setValidating(false);
    };

    // Only run validation if the user is defined
    if (user) {
      validateAdmin();
    }
  }, [user, navigate]);

  return [validating, !validating]; // Return loading and validation status
};

export default useAdminValidation;
