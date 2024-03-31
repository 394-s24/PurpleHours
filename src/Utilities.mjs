import 'firebase/database';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from 'firebase/database';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHMX3LqauP2z1mdng1xgaeHRf5qjAA9bY",
  authDomain: "purple-hours.firebaseapp.com",
  databaseURL: "https://purple-hours-default-rtdb.firebaseio.com",
  projectId: "purple-hours",
  storageBucket: "purple-hours.appspot.com",
  messagingSenderId: "289069179177",
  appId: "1:289069179177:web:91b16f6e4da77b7f611738"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create a reference to the database
const db = getDatabase(app);

// Data to be added
const groupsData = {
  id: 0,
  names: ["John", "Favour", "Charlie"],
  issue: "debugging",
  time : 1711920334
};

// Reference to the location where you want to save the data
const groupsRef = ref(db, 'cs211/favouroh1/groups/' + groupsData["id"]);

// Write data to the database
set(groupsRef, groupsData)
  .then(() => {
    console.log("Data saved successfully!");
  })
  .catch((error) => {
    console.log("The write failed...", error);
  });


