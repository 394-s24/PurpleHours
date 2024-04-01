import Queue from './Queue.jsx';

import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { retrieveGroupData } from '../DatabaseFuncs.mjs';

let queueData = [
  {names: 'Ella', issue: "My code doesn't work", time: '1:27 PM' },
  {names: 'James', issue: 'I found a bug', time: '1:30 PM' },
  {names: 'Anna', issue: 'Need help with an error', time: '1:45 PM' },
];

const Student = () => {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        let fetchedQueueData = await retrieveGroupData("cs211", "favouroh1");
        for (var i = 0; i < fetchedQueueData.length; i++) {
          
          var value = fetchedQueueData[i];
          
          // Convert unix time to readable time
          var unix_timestamp = value["time"];
          var date = new Date(unix_timestamp * 1000);
          var hours = date.getHours();
          var minutes = "0" + date.getMinutes();

          var formattedTime = hours + ':' + minutes.substr(-2);
          fetchedQueueData[i]["time"] = formattedTime;
          
          // Convert list of names to string
          var names = value["names"];
          var namesString = names.join(", ");
          fetchedQueueData[i]["names"] = namesString;
        }

        setQueue(fetchedQueueData);

        console.log(fetchedQueueData);
      } catch (error) {
        console.log("Error retrieving data", error);
      }
    };

    fetchQueueData();
  }, []);

  const handleQueue = () => {
    setQueue(currentQueue => currentQueue.slice(1));
  };

  return <Queue queue={queue} handleQueue={handleQueue} />;
};

export default Student;