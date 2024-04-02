import TAQueue from './TAQueue.jsx';

import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { retrieveGroupData } from '../DatabaseFuncs.mjs';

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

return <TAQueue queue={queue} handleQueue={handleQueue} />;
};

export default TA;