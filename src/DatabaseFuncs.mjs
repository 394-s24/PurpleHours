import 'firebase/database';
import { getDatabase, ref, set, get, push, remove, onValue, update} from 'firebase/database';
import { useCallback, useEffect, useState, useRef } from 'react';
// import app from './components/FirebaseApp';
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX11UIGxTsIeu_so42xYeXT0RA9nhTWLg",
  authDomain: "purple-hours-v2.firebaseapp.com",
  projectId: "purple-hours-v2",
  storageBucket: "purple-hours-v2.appspot.com",
  messagingSenderId: "365596552992",
  appId: "1:365596552992:web:c5c5597f110b1b6d33b145",
  measurementId: "G-46J1N3000X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create a reference to the database
const db = getDatabase(app);

async function createNewGroup(course, session, groupsData) {
  
  // const groupsData = {
  // names: names,
  // issue: issue,
  // time : Math.floor(Date.now() / 1000),
  // done : false,
  // public : false
  // };
  
  // Reference to the location where you want to save the data
  const groupRef = ref(db, `${course}/${session}/groups/`);

  try {
    let groupID = await push(groupRef, groupsData);
    let key = groupID.key;

    await update(ref(db, `${course}/${session}/groups/${key}`), {
      id: key // Assuming you want to save the key as an `id` field inside the pushed object
    });

    console.log("Data saved successfully!");
    return key;
  } catch (error) {
    console.error("The write failed...", error);
    return null;
  }
}

async function addToGroup(course, session, name, id) {
  try {
    let newEntryRef = await push(ref(db, `${course}/${session}/groups/` + id + "/names"), {
      name
    });
    console.log("Data updated successfully!");
    return newEntryRef.key; // Return the unique ID of the new entry
  }
  catch (error) {
    console.error("The update failed...", error);
    return null;
  }
}

async function removeFromGroup(course, session, uniqueId, groupId) {
  try {
    let nameRef = ref(db, `${course}/${session}/groups/` + groupId + "/names/" + uniqueId);
    let groupRef = ref(db, `${course}/${session}/groups/` + groupId);
    console.log(`${course}/${session}/groups/` + groupId + "/names/" + uniqueId);
    await remove(nameRef);
    console.log("Data removed successfully!");

    // Check if the group is empty, remove the group if it is
    const snapshot = await get(groupRef);

    console.log()

    // Group is empty when the name field is empty or doesn't exist
    if (!snapshot.exists() || !snapshot.val().names || Object.keys(snapshot.val().names).length === 0) {
      await removeGroup(course, session, groupId);
    }
  } catch (error) {
    console.error("The removal failed...", error);
  }
}

async function setGroupDone(course, session, id) {

  let groupRef = ref(db, `${course}/${session}/groups/` + id);
  try {
    await update(groupRef, {
      done: true
    });
    console.log("Data updated successfully!");

  }
  catch (error) {
    console.error("The update failed...", error);
  }

}

async function removeGroup(course, session, id) {
  try {
    let groupRef = ref(db, `${course}/${session}/groups/` + id);
    console.log(`${course}/${session}/groups/` + id);
    await remove(groupRef);
    console.log("Group removed successfully!");
  } catch (error) {
    console.error("The removal failed...", error);
  }
}

const useDbData = (course, session) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const groupsRef = ref(db, `${course}/${session}/groups/`);

  useEffect(() => (
    onValue(groupsRef, (snapshot) => {
     setData( snapshot.val() );
    }, (error) => {
      setError(error);
    })
  ), [ course, session ]);

  return [data, error];
};

// alternative way

// const useDbData = (course, session) => {
//   const [data, setData] = useState();
//   const [error, setError] = useState(null);

//   const prevDataRef = useRef();
//   const groupsRef = ref(db, `${course}/${session}/groups/`);
//   useEffect(() => {
    
//     onValue(groupsRef, (snapshot) => {
//       const newData = snapshot.val();
//       if (prevDataRef.current !== newData) {
//         setData(newData);
//         prevDataRef.current = newData;
//       }
//     }, (error) => {
//       setError(error);
//     });
//      return () => unsubscribe();
//   }, [ course, session ]);

//   return [ data, error ];
// };

export { createNewGroup, addToGroup, removeFromGroup, setGroupDone, useDbData};