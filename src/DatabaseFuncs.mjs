import 'firebase/database';
import { getDatabase, ref, set, push, onValue} from 'firebase/database';
import { useCallback, useEffect, useState, useRef } from 'react';
// import app from './components/FirebaseApp';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
const analytics = getAnalytics(app);

// Create a reference to the database
const db = getDatabase(app);

async function writeGroupData(course, session, groupsData) {
  
  // const groupsData = {
  // id: groupID,
  // names: names,
  // issue: issue,
  // time : Math.floor(Date.now() / 1000),
  // done : false,
  // };
  
  // Reference to the location where you want to save the data
  const groupsRef = ref(db, `${course}/${session}/groups/` + groupsData["id"]);

  try {
    await set(groupsRef, groupsData)
    
    console.log("Data saved successfully!");
    return 200; 
  } catch (error) {
    console.error("The write failed...", error);
    return 500; 
  }
}

async function addToGroup(course, session, name, id) {
  try {
    push(ref(db, `${course}/${session}/groups/` + id + "/names"), {
      name
    });
    console.log("Data updated successfully!");
  }
  catch (error) {
    console.error("The update failed...", error);
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


export { writeGroupData, addToGroup, useDbData};