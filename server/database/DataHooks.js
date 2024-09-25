import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "./FirebaseApp";

const db = getDatabase(app);

export const useDbData = (course) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const courseRef = ref(db, `queues/${course}/groups`);
    // Set up a real-time listener for the queue data
    const unsubscribe = onValue(
      courseRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          setData(null);
        }
      },
      (error) => {
        setError(error);
      }
    );

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [course]);

  return [data, error];
};