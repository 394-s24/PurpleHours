import TAQueue from './TAQueue';
import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

const TA = ({ queue, dbArgs }) => {
  const [refinedQueue, setRefinedQueue] = useState([]);

  useEffect(() => {
    // Checks if queue is defined
    if (queue) {
      // Format queue data
      const formattedQueue = Object.values(queue).map((item) => {
        // Convert unix time to readable time
        const unixTimestamp = item.time;
        const date = new Date(unixTimestamp * 1000);
        const hours = date.getHours();
        const minutes = '0' + date.getMinutes();
        const formattedTime = isNaN(date.getTime())
          ? 'Invalid Time'
          : `${hours}:${minutes.substr(-2)}`;

        // Convert list of names to string
        const namesObjects = item['names'];
        let namesArray = ['No members'];
        if (namesObjects) {
          namesArray = Object.values(namesObjects).map((obj) => {
            return obj['name'];
          });
        }
        const namesString = namesArray.join(', ');

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

  const handleDone = () => {
    // Logic for removing the first group from the database
  };

  return <TAQueue queue={refinedQueue} handleDone={handleDone} />;
};

export default TA;
