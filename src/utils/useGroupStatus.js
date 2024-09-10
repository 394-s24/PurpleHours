import { useEffect, useState } from "react";
import { ref, onValue, getDatabase } from "firebase/database";

import app from "../../server/database/FirebaseApp";

const useGroupStatus = (course, user) => {
  const db = getDatabase(app);
  const [inGroup, setInGroup] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      const userRef = ref(db, `users/${user.uid}/inGroup`);

      // Listen to inGroup changes in the database in real-time
      const unsubscribe = onValue(userRef, (snapshot) => {
        const inGroupData = snapshot.val() || {};
        setInGroup(inGroupData[course] || false); // Set based on the course flag
      });

      return () => {
        unsubscribe(); // Cleanup the listener when the component unmounts
      };
    }
  }, [course, user]);

  return [inGroup, setInGroup];
};

export default useGroupStatus;
