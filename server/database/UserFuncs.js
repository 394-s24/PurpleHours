import {
  getDatabase,
  ref,
  set,
  get,
  update,
  increment,
} from "firebase/database";
import app from "./FirebaseApp";

const db = getDatabase(app);

// Utility to reset the help counters if it's a new day or month
export const updateHelpCountersIfNeeded = async (uid, displayName) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    // Initialize the user counters if they don't exist
    await set(userRef, {
      displayName: displayName,
      inGroup: false,
      dailyHelpCount: 0,
      monthlyHelpCount: 0,
      lifetimeHelpCount: 0,
      lastHelpedDate: new Date().toISOString().split("T")[0],
      lastHelpedMonth: new Date().toISOString().slice(0, 7),
    });
    return;
  }

  const userData = snapshot.val();
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().toISOString().slice(0, 7);

  let updates = {};

  // Reset daily help count if the day has changed
  if (userData.lastHelpedDate !== today) {
    updates.dailyHelpCount = 0;
    updates.lastHelpedDate = today;
  }

  // Reset monthly help count if the month has changed
  if (userData.lastHelpedMonth !== currentMonth) {
    updates.monthlyHelpCount = 0;
    updates.lastHelpedMonth = currentMonth;
  }

  if (Object.keys(updates).length > 0) {
    await update(userRef, updates);
  }
};

export const incrementHelpCounters = async (uid) => {
  const userRef = ref(db, `users/${uid}`);

  // Update counters
  await update(userRef, {
    dailyHelpCount: increment(1),
    monthlyHelpCount: increment(1),
    lifetimeHelpCount: increment(1),
  });
};

export const getUserHelpCountsSingle = async (uid) => {
  const userRef = ref(db, `users/${uid}/dailyHelpCount`);
  const snapshot = await get(userRef);
  return snapshot.exists() ? snapshot.val() : 0;
};

export const getUserHelpCounts = async (names) => {
  const counts = {};
  for (const nameObj of names) {
    counts[nameObj.uid] = await getUserHelpCountsSingle(nameObj.uid);
  }
  return counts;
};

export const initializeUserIfNeeded = async (uid, displayName) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    await set(userRef, {
      displayName: displayName,
      inGroup: false,
      dailyHelpCount: 0,
      monthlyHelpCount: 0,
      lifetimeHelpCount: 0,
      lastHelpedDate: new Date().toISOString().split("T")[0],
      lastHelpedMonth: new Date().toISOString().slice(0, 7),
    });
  }
};

export const isUserInGroup = async (uid) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const userData = snapshot.val();
    return userData.inGroup;
  } else {
    throw new Error(`User with uid ${uid} does not exist.`);
  }
};

export const setInGroupStatus = async (uid, inGroup) => {
  const userRef = ref(db, `users/${uid}`);
  await update(userRef, { inGroup });
};
