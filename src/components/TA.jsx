import Queue from './TAQueue.jsx';

import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { retrieveGroupData } from '../DatabaseFuncs.mjs';

let queueData = [
    {names: 'Ella', issue: "My code doesn't work", time: '1:27 PM' },
    {names: 'James', issue: 'I found a bug', time: '1:30 PM' },
    {names: 'Anna', issue: 'Need help with an error', time: '1:45 PM' },
  ];
  
const TA = () => {
const [queue, setQueue] = useState([]);

useEffect(() => {
    const fetchQueueData = async () => {
    try {
        let fetchedQueueData = await retrieveGroupData("cs211", "favouroh1");
        for (let i = 0; i < fetchedQueueData.length; i++) {
        
        let value = fetchedQueueData[i];
        
        // Convert unix time to readable time
        let unix_timestamp = value["time"];
        let date = new Date(unix_timestamp * 1000);
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();

        let formattedTime = hours + ':' + minutes.substr(-2);
        fetchedQueueData[i]["time"] = formattedTime;
        
        // Convert list of names to string
        let namesObjects = value["names"];
        let namesArray = Object.values(namesObjects).map((obj) => {return obj["name"]});
        let namesString = namesArray.join(", ");
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

export default TA;