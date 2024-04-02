import StudentQueue from './StudentQueue.jsx';
import './Student.css';

import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { addToGroup} from '../DatabaseFuncs.mjs';
import { set } from 'firebase/database';
import { Button } from 'react-bootstrap';

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

  const [refinedQueue, setRefinedQueue] = useState([]);

  useEffect(() => {
    // Checks if queue is defined
    if (queue) {
      // Format queue data
      const formattedQueue = queue.map((item) => {
        // Convert unix time to readable time
        const unixTimestamp = item.time;
        const date = new Date(unixTimestamp * 1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const formattedTime = isNaN(date.getTime()) ? "Invalid Time" : `${hours}:${minutes.substr(-2)}`;

        // Convert list of names to string
        const namesObjects = item["names"];
        const namesArray = Object.values(namesObjects).map((obj) => {return obj["name"]});
        const namesString = namesArray.join(", "); 

        // Return a new object with formatted time and names
        return {
          ...item,
          time: formattedTime,
          names: namesString,
        };
      });

      // Update state
      setRefinedQueue(formattedQueue);
    }
  }, [queue]);

  const handleQueue = (id) => {
    addToGroup("cs211", "favouroh1", "Jack", id);
  };

  return (
    <div className="student_view">
      <div className="queue">
        <StudentQueue queue={refinedQueue} handleQueue={handleQueue} />
      </div>
      <div className="new">
        <Button variant="primary">I Need Help</Button>
      </div>
    </div>

  );
};

export default Student;