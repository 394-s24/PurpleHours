import "firebase/database";
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  remove,
  onValue,
  update,
  increment,
} from "firebase/database";
import { useCallback, useEffect, useState, useRef } from "react";
// import app from './components/FirebaseApp';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX11UIGxTsIeu_so42xYeXT0RA9nhTWLg",
  authDomain: "purple-hours-v2.firebaseapp.com",
  projectId: "purple-hours-v2",
  storageBucket: "purple-hours-v2.appspot.com",
  messagingSenderId: "365596552992",
  appId: "1:365596552992:web:c5c5597f110b1b6d33b145",
  measurementId: "G-46J1N3000X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create a reference to the database
const db = getDatabase(app);

async function createNewGroup(course, groupsData) {
  // Reference to the location where you want to save the data
  const groupRef = ref(db, `${course}/groups/`);

  try {
    let groupID = await push(groupRef, groupsData);
    let key = groupID.key;

    await update(ref(db, `${course}/groups/${key}`), {
      id: key, // Assuming you want to save the key as an `id` field inside the pushed object
    });

    console.log("Data saved successfully!");
    return key;
  } catch (error) {
    console.error("The write failed...", error);
    return null;
  }
}

async function addToGroup(course, groupId, displayName, uid) {
  try {
    let newEntryRef = await set(
      ref(db, `${course}/groups/` + groupId + "/names/" + uid),
      {
        name: displayName,
        uid: uid,
      },
    );
    console.log("Data updated successfully!");
  } catch (error) {
    console.error("The update failed...", error);
    return null;
  }
}

async function removeFromGroup(course, uniqueId, groupId) {
  try {
    const nameRef = ref(db, `${course}/groups/` + groupId + "/names/" + uniqueId);
    const groupRef = ref(db, `${course}/groups/` + groupId);

    await remove(nameRef);
    console.log("Data removed successfully!");

    // Check if the group is empty, remove the group if it is
    const snapshot = await get(groupRef);
    if (
      !snapshot.exists() ||
      !snapshot.val().names ||
      Object.keys(snapshot.val().names).length === 0
    ) {
      await removeGroup(course, groupId);
    }
  } catch (error) {
    console.error("The removal failed...", error);
  }
}

async function removeGroup(course, id) {
  try {
    let groupRef = ref(db, `${course}/groups/` + id);
    console.log(`${course}/groups/` + id);
    await remove(groupRef);
    console.log("Group removed successfully!");
  } catch (error) {
    console.error("The removal failed...", error);
  }
}

async function removeGroupAndIncrement(course, id) {
  try {
    const groupRef = ref(db, `${course}/groups/` + id);

    // Fetch group data
    const snapshot = await get(groupRef);
    const group = snapshot.val();

    if (!group || !group.names) {
      console.error("Group or names not found, skipping updates.");
      return;
    }

    const names = group.names;

    // Update help counters for all users in the group concurrently
    const updatePromises = Object.keys(names).map(async (uid) => {
      try {
        await updateHelpCountersIfNeeded(uid);
        await incrementHelpCounters(uid);
      } catch (error) {
        console.error(`Failed to update counters for user ${uid}:`, error);
      }
    });

    // Wait for all counter updates to complete
    await Promise.all(updatePromises);

    // Remove the group after all updates are completed
    await remove(groupRef);
    console.log("Group removed successfully!");

  } catch (error) {
    console.error("Failed to remove group or update counters:", error);
  }
}

async function setGroupHelping(course, groupId, user) {
  const groupRef = ref(db, `${course}/groups/` + groupId);

  try {
    // Update the group to indicate the user is helping
    await update(groupRef, {
      currentlyHelping: true,
      helper: { name: user.displayName, uid: user.uid },
    });

    console.log("Data updated successfully!");
  } catch (error) {
    console.error("The update failed...", error);
  }
}

// Utility to reset the help counters if it's a new day or month
const updateHelpCountersIfNeeded = async (uid) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    // Initialize the user counters if they don't exist
    await set(userRef, {
      dailyHelpCount: 0,
      monthlyHelpCount: 0,
      lifetimeHelpCount: 0,
      lastHelpedDate: new Date().toISOString().split('T')[0],
      lastHelpedMonth: new Date().toISOString().slice(0, 7)
    });
    return;
  }

  const userData = snapshot.val();
  const today = new Date().toISOString().split('T')[0];
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

const incrementHelpCounters = async (uid) => {
  const userRef = ref(db, `users/${uid}`);

  // Update counters
  await update(userRef, {
    dailyHelpCount: increment(1),
    monthlyHelpCount: increment(1),
    lifetimeHelpCount: increment(1),
  });
};

const getUserHelpCounts = async (names) => {
  const db = getDatabase();
  const counts = {};

  for (const nameObj of names) {
    const userRef = ref(db, `users/${nameObj.uid}/dailyHelpCount`);
    const snapshot = await get(userRef);
    counts[nameObj.uid] = snapshot.exists() ? snapshot.val() : 0;
  }

  return counts;
};

const initializeUserIfNeeded = async (uid, displayName) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    await set(userRef, {
      displayName,
      dailyHelpCount: 0,
      monthlyHelpCount: 0,
      lifetimeHelpCount: 0,
      lastHelpedDate: new Date().toISOString().split('T')[0],
      lastHelpedMonth: new Date().toISOString().slice(0, 7),
    });
  }
};

const useDbData = (course) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const groupsRef = ref(db, `${course}/groups/`);

  useEffect(
    () =>
      onValue(
        groupsRef,
        (snapshot) => {
          setData(snapshot.val());
        },
        (error) => {
          setError(error);
        },
      ),
    [course],
  );

  return [data, error];
};

const signInWithGoogle = () => {
  signInWithPopup(getAuth(app), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(app));

const useAuthState = () => {
  const [user, setUser] = useState();

  useEffect(() => onAuthStateChanged(getAuth(app), setUser), []);

  return [user];
};

export {
  createNewGroup,
  addToGroup,
  removeFromGroup,
  useDbData,
  setGroupHelping,
  initializeUserIfNeeded,
  removeGroup,
  removeGroupAndIncrement,
  getUserHelpCounts,
  signInWithGoogle,
  firebaseSignOut,
  useAuthState,
};
