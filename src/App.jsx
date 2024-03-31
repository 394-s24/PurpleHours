import './App.css';
import Queue from './components/Queue.jsx';
import 'firebase/database';
import { initializeApp } from 'firebase/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
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

let queueData = [
  {names: 'Ella', issue: "My code doesn't work", time: '1:27 PM' },
  {names: 'James', issue: 'I found a bug', time: '1:30 PM' },
  {names: 'Anna', issue: 'Need help with an error', time: '1:45 PM' },
];

(async () => {
  try {
    console.log(queueData);
    queueData = await retrieveGroupData("cs211", "favouroh1");
    console.log(queueData);
    for (var i = 0; i < queueData.length; i++) {
      var value = queueData[i];
      var unix_timestamp = value["time"];

      var date = new Date(unix_timestamp * 1000);

      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();

      // Will display time in 10:30 format
      var formattedTime = hours + ':' + minutes.substring(-2);
      queueData[i]["time"] = formattedTime;

      // Change names from array to string
      var names = value["names"];
      var namesString = names.join(", ");
      queueData[i]["names"] = namesString;
    }

    console.log("Data retrieved from the database:", queueData);
    // Do something with the data
  } catch (error) {
    // Handle errors here
    console.log("Error retrieving data", error);
  }
})();

const App = () => {

  const [queue, setQueue] = useState(queueData);
  console.log(queueData);
  const handleQueue = () => {
    console.log('Handling queue');
    setQueue(queue.slice(1));
  };

  return <Queue queue={queue} handleQueue={handleQueue} />;
};

export default App;
