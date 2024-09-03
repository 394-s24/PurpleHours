import { getDatabase, ref, get } from "firebase/database";
import { removeGroup } from "./GroupFuncs";
import app from "./FirebaseApp";

const db = getDatabase(app);

export const clearQueue = async () => {
  try {
    const queuesRef = ref(db, `queues/`);
    const snapshot = await get(queuesRef);

    const removePromises = [];

    if (snapshot.exists()) {
      const courses = snapshot.val();
      for (const course in courses) {
        const groups = courses[course].groups;
        if (groups) {
          for (const groupId in groups) {
            removePromises.push(removeGroup(course, groupId));
          }
        }
      }
    }

    await Promise.all(removePromises);

    console.log("All groups removed successfully!");
  } catch (error) {
    console.error("Failed to clear queue:", error);
  }
};
