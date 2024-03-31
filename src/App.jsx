import './App.css';
import Queue from './components/Queue.jsx';
import Student from './components/Student.jsx';
import TA from './components/TA.jsx';

import 'firebase/database';
import { initializeApp } from 'firebase/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { retrieveGroupData } from './Utilities.mjs';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCHMX3LqauP2z1mdng1xgaeHRf5qjAA9bY',
  authDomain: 'purple-hours.firebaseapp.com',
  databaseURL: 'https://purple-hours-default-rtdb.firebaseio.com',
  projectId: 'purple-hours',
  storageBucket: 'purple-hours.appspot.com',
  messagingSenderId: '289069179177',
  appId: '1:289069179177:web:91b16f6e4da77b7f611738',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// let queueData = [
//   {names: 'Ella', issue: "My code doesn't work", time: '1:27 PM' },
//   {names: 'James', issue: 'I found a bug', time: '1:30 PM' },
//   {names: 'Anna', issue: 'Need help with an error', time: '1:45 PM' },
// ];

const App = () => {
  // const [queue, setQueue] = useState([]);

  // useEffect(() => {
  //   const fetchQueueData = async () => {
  //     try {
  //       let fetchedQueueData = await retrieveGroupData("cs211", "favouroh1");
  //       for (var i = 0; i < fetchedQueueData.length; i++) {
          
  //         var value = fetchedQueueData[i];
          
  //         // Convert unix time to readable time
  //         var unix_timestamp = value["time"];
  //         var date = new Date(unix_timestamp * 1000);
  //         var hours = date.getHours();
  //         var minutes = "0" + date.getMinutes();

  //         var formattedTime = hours + ':' + minutes.substr(-2);
  //         fetchedQueueData[i]["time"] = formattedTime;
          
  //         // Convert list of names to string
  //         var names = value["names"];
  //         var namesString = names.join(", ");
  //         fetchedQueueData[i]["names"] = namesString;
  //       }

  //       setQueue(fetchedQueueData);

  //       console.log(fetchedQueueData);
  //     } catch (error) {
  //       console.log("Error retrieving data", error);
  //     }
  //   };

  //   fetchQueueData();
  // }, []);

  // const handleQueue = () => {
  //   setQueue(currentQueue => currentQueue.slice(1));
  // };

  return(
    <div className="App">
      <Student />
      <TA />
    </div>
  );
};

export default App;
