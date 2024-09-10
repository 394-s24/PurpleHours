import { getDatabase, ref, get } from "firebase/database";
import app from "./FirebaseApp";

const db = getDatabase(app);

export const isValidCourse = async (course) => {
  const courseRef = ref(db, `courses/${course}`);
  const snapshot = await get(courseRef);

  return snapshot.exists() && snapshot.val().active;
}
