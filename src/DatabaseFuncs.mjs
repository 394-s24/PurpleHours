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

// async function setupUserPresence(course, userId, groupId) {
//   const user = ref(db, `users/${userId}`);
//   const userRef = ref(db, `users/${userId}/status`);

//   set(userRef, {
//     online: true,
//     lastOnline: serverTimestamp()
//   });

//   onDisconnect(userRef).set({
//     online: false,
//     lastOnline: serverTimestamp()
//   });
// }

async function addToGroup(course, groupId, displayName, uid) {
  try {
    let newEntryRef = await set(ref(db, `${course}/groups/` + groupId + "/names/" + uid), {
      name: displayName,
      uid: uid,
    });
    console.log("Data updated successfully!");
  } catch (error) {
    console.error("The update failed...", error);
    return null;
  }
}

async function removeFromGroup(course, uniqueId, groupId) {
  try {
    let nameRef = ref(db, `${course}/groups/` + groupId + "/names/" + uniqueId);
    let groupRef = ref(db, `${course}/groups/` + groupId);
    console.log(`${course}/groups/` + groupId + "/names/" + uniqueId);
    await remove(nameRef);
    console.log("Data removed successfully!");

    // Check if the group is empty, remove the group if it is
    const snapshot = await get(groupRef);

    console.log();

    // Group is empty when the name field is empty or doesn't exist
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

async function setGroupHelping(course, id) {
  let groupRef = ref(db, `${course}/groups/` + id);
  try {
    await update(groupRef, {
      currentlyHelping: true,
    });
    console.log("Data updated successfully!");
  } catch (error) {
    console.error("The update failed...", error);
  }
}

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

// export { firebaseSignOut as signOut };

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
  removeGroup,
  signInWithGoogle,
  firebaseSignOut,
  useAuthState,
};
