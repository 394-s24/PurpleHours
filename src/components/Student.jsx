import StudentQueue from './StudentQueue.jsx';

import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { retrieveGroupData, addToGroup} from '../DatabaseFuncs.mjs';
import { set } from 'firebase/database';

let queueData = [
  {id: 0, names: 'Ella', issue: "My code doesn't work", time: '1:27 PM' },
  {id: 1, names: 'James', issue: 'I found a bug', time: '1:30 PM' },
  {id: 2, names: 'Anna', issue: 'Need help with an error', time: '1:45 PM' },
];

const Student = ({queue}) => {
  
  // setQueue(data);
  // console.log(data);

  // const fetchQueueData = async () => {
  //   try {
  //     let fetchedQueueData = await retrieveGroupData("cs211", "favouroh1");
  //     // console.log(data);
  //     // console.log(fetchedQueueData)
  //     for (let i = 0; i < fetchedQueueData.length; i++) {
        
  //       let value = fetchedQueueData[i];
  //       // let id = value["id"]
        
  //       // Convert unix time to readable time
  //       let unix_timestamp = value["time"];
  //       let date = new Date(unix_timestamp * 1000);
  //       let hours = date.getHours();
  //       let minutes = "0" + date.getMinutes();

  //       let formattedTime = hours + ':' + minutes.substr(-2);
  //       fetchedQueueData[i]["time"] = formattedTime;
        
  //       // Convert list of names to string
  //       let namesObjects = value["names"];
  //       let namesArray = Object.values(namesObjects).map((obj) => {return obj["name"]});
  //       let namesString = namesArray.join(", ");
  //       fetchedQueueData[i]["names"] = namesString;
  //     }

  //     setQueue(fetchedQueueData);

  //     // console.log(fetchedQueueData);
  //   } catch (error) {
  //     console.log("Error retrieving data", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchQueueData();
  // }, []);

  const refinedQueue = queue;
  console.log(refinedQueue)
  
  for (let i = 0; i < refinedQueue.length; i++) {
        
    let value = refinedQueue[i];
    // let id = value["id"]
    
    // Convert unix time to readable time
    let unix_timestamp = value["time"];
    let date = new Date(unix_timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();

    let formattedTime = hours + ':' + minutes.substr(-2);
    refinedQueue[i]["time"] = formattedTime;
    
    // Convert list of names to string
    let namesObjects = value["names"];
    let namesArray = Object.values(namesObjects).map((obj) => {return obj["name"]});
    let namesString = namesArray.join(", ");
    refinedQueue[i]["names"] = namesString;
  }

  const handleQueue = (id) => {
    addToGroup("cs211", "favouroh1", "Jack", id)
  };

  return <StudentQueue queue={refinedQueue} handleQueue={handleQueue} />;
  // console.log(queue)
  // return <h1>Student</h1>
};

export default Student;