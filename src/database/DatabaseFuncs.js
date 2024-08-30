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
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Firebase configuration
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
    const helpCount = await getUserHelpCountsSingle(uid);

    // Generate a new entry with a unique key based on a timestamp
    const newEntryRef = push(ref(db, `${course}/groups/` + groupId + "/names/"));
    
    // Set the data for this entry
    await set(newEntryRef, {
      name: displayName,
      uid: uid,
      helpCount: helpCount
    });

    console.log("Data added successfully in order!");
  } catch (error) {
    console.error("The update failed...", error);
    return null;
  }
}

async function removeFromGroup(course, uid, groupId) {
  try {
    const groupRef = ref(db, `${course}/groups/` + groupId + "/names/");
    const snapshot = await get(groupRef);

    if (!snapshot.exists()) {
      console.log("Group does not exist or no names found.");
      return;
    }

    const names = snapshot.val();
    let keyToRemove = null;

    // Find the correct key that matches the uid
    for (const key in names) {
      if (names[key].uid === uid) {
        keyToRemove = key;
        break;
      }
    }

    if (keyToRemove) {
      const nameRef = ref(db, `${course}/groups/` + groupId + "/names/" + keyToRemove);
      await remove(nameRef);
      console.log("User removed successfully!");

      // Check if the group is now empty and remove the group if it is
      const updatedSnapshot = await get(groupRef);
      if (
        !updatedSnapshot.exists() ||
        Object.keys(updatedSnapshot.val()).length === 0
      ) {
        await removeGroup(course, groupId);
      }
    } else {
      console.log("User not found in the group.");
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
        await updateHelpCountersIfNeeded(names[uid].uid, names[uid].name);
        await incrementHelpCounters(names[uid].uid);
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
const updateHelpCountersIfNeeded = async (uid, displayName) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    // Initialize the user counters if they don't exist
    await set(userRef, {
      displayName: displayName,
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

export const getUserHelpCountsSingle = async (uid) => {
  const userRef = ref(db, `users/${uid}/dailyHelpCount`);
  const snapshot = await get(userRef);
  return snapshot.exists() ? snapshot.val() : 0;
}

const getUserHelpCounts = async (names) => {
  const counts = {};
  for (const nameObj of names) {
    counts[nameObj.uid] = await getUserHelpCountsSingle(nameObj.uid);
  }
  return counts;
};

const initializeUserIfNeeded = async (uid, displayName) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    await set(userRef, {
      displayName: displayName,
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

  useEffect(() => {
    const unsubscribe = onValue(groupsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const groupsData = snapshot.val();
        for (const groupId in groupsData) {
          for (const uid in groupsData[groupId].names) {
            const helpCount = await getUserHelpCountsSingle(uid);
            groupsData[groupId].names[uid].helpCount = helpCount;
          }
        }
        setData(groupsData);
      } else {
        setData(null);
      }
    }, (error) => {
      setError(error);
    });

    return () => unsubscribe();
  }, [course]);

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

