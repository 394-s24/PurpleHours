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
export const updateHelpCountersIfNeeded = async (uid, displayName, course) => {
  const userCourseRef = ref(db, `courses/${course}/users/${uid}`);
  const userCourseSnapshot = await get(userCourseRef);

  if (!userCourseSnapshot.exists()) {
    // Initialize the user counters if they don't exist
    await set(userCourseRef, {
      displayName: displayName,
      dailyHelpCount: 0,
      monthlyHelpCount: 0,
      lifetimeHelpCount: 0,
      lastHelpedDate: getChicagoDate(),
      lastHelpedMonth: getChicagoMonth(),
      inGroup: false,
      isTA: true,
    });
    return;
  }

  const userData = userCourseSnapshot.val();
  const today = getChicagoDate();
  const currentMonth = getChicagoMonth();

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
    await update(userCourseRef, updates);
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
  const chicagoDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());

  // Since `Intl.DateTimeFormat` returns the date in the format "MM/YYYY"
  const [month, year] = chicagoDate.split("/");
  return `${year}-${month}`;
};

export const incrementHelpCounters = async (uid, course) => {
  const userRef = ref(db, `courses/${course}/users/${uid}`);
  
  // Update counters
  await update(userRef, {
    dailyHelpCount: increment(1),
    monthlyHelpCount: increment(1),
    lifetimeHelpCount: increment(1),
  });
};

export const getUserHelpCountsSingle = async (uid, course) => {
  const userRef = ref(db, `courses/${course}/users/${uid}/dailyHelpCount`);
  const snapshot = await get(userRef);
  return snapshot.exists() ? snapshot.val() : 0;
};

export const getUserHelpCounts = async (names, course) => {
  const counts = {};
  for (const nameObj of names) {
    counts[nameObj.uid] = await getUserHelpCountsSingle(nameObj.uid, course);
  }
  return counts;
};

export const initializeUserIfNeeded = async (user, course) => {
  const userRef = ref(db, `users/${user.uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    set(userRef, {
      displayName: user.displayName,
      email: user.email,
      isAdmin: false,
    });
  }

  const userCourseRef = ref(db, `courses/${course}/users/${user.uid}`);
  const userCourseSnapshot = await get(userCourseRef);

  if (!userCourseSnapshot.exists()) {
    // Initialize the user counters if they don't exist
    set(userCourseRef, {
      displayName: user.displayName,
      dailyHelpCount: 0,
      monthlyHelpCount: 0,
      lifetimeHelpCount: 0,
      lastHelpedDate: getChicagoDate(),
      lastHelpedMonth: getChicagoMonth(),
      inGroup: false,
      isTA: false,
    });
    return;
  }
};

export const isUserInGroup = async (uid, course) => {
  const userRef = ref(db, `courses/${course}/users/${uid}/inGroup`);
  const snapshot = await get(userRef);

  return snapshot.val() === true ? snapshot.exists() : false;
};

export const setInGroupStatus = async (uid, course, inGroup) => {
  const userRef = ref(db, `courses/${course}/users/${uid}`);
  await update(userRef, { inGroup: inGroup });
};

export const isUserTA = async (uid, course) => {
  const userRef = ref(db, `courses/${course}/users/${uid}/isTA`);
  const snapshot = await get(userRef);

  return snapshot.val() === true ? snapshot.exists() : false;
}

export const isUserAdmin = async (uid) => {
  const userRef = ref(db, `users/${uid}/isAdmin`);
  const snapshot = await get(userRef);

  return snapshot.val() === true ? snapshot.exists() : false;
}
