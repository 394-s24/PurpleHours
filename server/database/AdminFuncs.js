import { getDatabase, ref, get, update } from "firebase/database";

import app from "./FirebaseApp";

const db = getDatabase(app);

// Fetch all users from Firebase
export const getUsers = async () => {
  const usersRef = ref(db, "users");
  const snapshot = await get(usersRef);

  if (!snapshot.exists()) {
    return [];
  }
  const usersData = snapshot.val();
  const users = Object.keys(usersData).map((uid) => ({
    uid: uid,
    displayName: usersData[uid].displayName,
    email: usersData[uid].email,
  }));

  return users;
};

// Fetch all courses from Firebase
export const getCourses = async () => {
  const coursesRef = ref(db, "courses");
  const snapshot = await get(coursesRef);

  if (!snapshot.exists()) {
    return [];
  }
  const coursesData = snapshot.val();
  const courses = Object.keys(coursesData).map((courseKey) => ({
    number: courseKey,
    name: coursesData[courseKey].name,
  }));

  return courses;
};

// Update TA permissions for a user on a specific course
export const updateTAPermissions = async (uid, courseId, isTA) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const updates = {};
    updates[`/isTA/${courseId}`] = isTA;
    await update(userRef, updates);
  } else {
    throw new Error("User does not exist");
  }
};
