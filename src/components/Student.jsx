import StudentQueue from './StudentQueue.jsx';
import './Student.css';

import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { addToGroup} from '../DatabaseFuncs.mjs';
import { set } from 'firebase/database';
import { Button } from 'react-bootstrap';

const Student = ({queue}) => {

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