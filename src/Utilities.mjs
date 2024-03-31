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

async function writeGroupData(groupID, names, issue) {
  
  const groupsData = {
    id: groupID,
    names: names,
    issue: issue,
    time : Math.floor(Date.now() / 1000)
  };
  
  // Reference to the location where you want to save the data
  const groupsRef = ref(db, 'cs211/favouroh1/groups/' + groupsData["id"]);

  try {
    await set(groupsRef, groupsData)
    
    console.log("Data saved successfully!");
    return 200; 
  } catch (error) {
    console.error("The write failed...", error);
    return 500; 
  }
}

async function retrieveGroupData(class, oh_sec){
  

}




