import TAQueue from './TAQueue.jsx';
import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { setGroupDone } from '../DatabaseFuncs.mjs'

const TA = ({queue, dbArgs}) => {

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
          const minutes = "0" + date.getMinutes();
          const formattedTime = isNaN(date.getTime()) ? "Invalid Time" : `${hours}:${minutes.substr(-2)}`;
  
          // Convert list of names to string
          const namesObjects = item["names"];
          let namesArray = ["No members"];
          if (namesObjects) {
            namesArray = Object.values(namesObjects).map((obj) => {return obj["name"]});
          }
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

    const handleDone = (groupId) => {
      // Logic for removing the first group from the database
      setGroupDone(dbArgs[0], dbArgs[1], groupId);
    };

    const navigate = useNavigate();
    const handleBack = () => {
      navigate('/')
    };

return (
  <div>
    <Button variant="dark" onClick={() => handleBack()}>Go Back</Button>
    <TAQueue queue={refinedQueue} handleDone={handleDone} />
  </div>);
};

export default TA;