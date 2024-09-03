import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "./FirebaseApp";

const db = getDatabase(app);

export const useDbData = (course) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const groupsRef = ref(db, `queues/${course}/groups/`);

  useEffect(() => {
    const unsubscribe = onValue(
      groupsRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const groupsData = snapshot.val();
          setData(groupsData);
        } else {
          setData(null);
        }
      },
      (error) => {
        setError(error);
      },
    );

    return () => unsubscribe();
  }, [course]);

  return [data, error];
};
