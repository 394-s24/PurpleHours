import {
  getDatabase,
  ref,
  set,
  get,
  update,
} from "firebase/database";
import app from "./FirebaseApp";

const db = getDatabase(app);

export const setUserTA = async (uid, course, isTA) => {
  const userRef = ref(db, `users/${uid}/isTA`);

  if (isTA) {
    await update(userRef, { [course]: true });
  } else {
    await update(userRef, { [course]: false });
  }
};
