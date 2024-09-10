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
      inGroup: {},
      dailyHelpCount: 0,
      monthlyHelpCount: 0,
      lifetimeHelpCount: 0,
      lastHelpedDate: getChicagoDate(), // Use Chicago time for date initialization
      lastHelpedMonth: getChicagoMonth(), // Use Chicago time for month initialization
    });
    return;
  }

  const userData = snapshot.val();
  const today = getChicagoDate(); // Use Chicago time for today's date
  const currentMonth = getChicagoMonth(); // Use Chicago time for the current month

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

// Helper function to get today's date in Chicago timezone (YYYY-MM-DD)
const getChicagoDate = () => {
  const chicagoDate = new Date().toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [month, day, year] = chicagoDate.split("/");
  return `${year}-${month}-${day}`;
};

// Helper function to get the current month in Chicago timezone (YYYY-MM)
const getChicagoMonth = () => {
  const chicagoDate = new Date().toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
  });

  const [month, , year] = chicagoDate.split("/");
  return `${year}-${month}`;
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
      inGroup: {},
      dailyHelpCount: 0,
      monthlyHelpCount: 0,
      lifetimeHelpCount: 0,
      lastHelpedDate: new Date().toISOString().split("T")[0],
      lastHelpedMonth: new Date().toISOString().slice(0, 7),
    });
  }
};

export const isUserInGroup = async (uid, course) => {
  const userRef = ref(db, `users/${uid}/inGroup/${course}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    return snapshot.val() === true; // Return true if the course flag is set to true
  } else {
    return false; // Return false if the flag doesn't exist
  }
};

export const setInGroupStatus = async (uid, course, inGroup) => {
  const userRef = ref(db, `users/${uid}/inGroup`);

  if (inGroup) {
    // User joins the group for the course, set the flag to true
    await update(userRef, { [course]: true });
  } else {
    // User leaves the group for the course, set the flag to false
    await update(userRef, { [course]: false });
  }
};
