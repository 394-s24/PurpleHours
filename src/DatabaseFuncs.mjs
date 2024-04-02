import 'firebase/database';
import { getDatabase, ref, set, push, onValue} from 'firebase/database';
// import app from './components/FirebaseApp';
import { initializeApp } from "firebase/app";

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

async function retrieveGroupData(course, session) {
  return new Promise((resolve, reject) => {
    // Reference to the location where you want to retrieve the data
    const groupsRef = ref(db, `${course}/${session}/groups/`);

    onValue(groupsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let res = [];
        
        for (const [key, value] of Object.entries(data)) {
          console.log(`${key}: ${value}`);
          res.push(value);
        }
        console.log(res);
        resolve(res);

      } else {
        console.log("No data available");
        reject(null);
      }
    }, {
      onlyOnce: false
    });
  });
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

export { writeGroupData, retrieveGroupData, addToGroup };

// addToGroup("cs211", "favouroh1", "Dave", "1");

// (async () => {
//   try {
//     const data = await retrieveGroupData("cs211", "favouroh1");
//     console.log("Data retrieved from the database:", data);
//     // Do something with the data
//   } catch (error) {
//     // Handle errors here
//     console.log("Error retrieving data", error);
//   }
// })();
