import './App.css';
import Student from './components/Student.jsx';
import TA from './components/TA.jsx';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { retrieveGroupData, useDbData } from './DatabaseFuncs.mjs';

import 'firebase/database';
import { initializeApp } from 'firebase/app';
import 'bootstrap/dist/css/bootstrap.min.css';

// let queueData = [
//   {names: 'Ella', issue: "My code doesn't work", time: '1:27 PM' },
//   {names: 'James', issue: 'I found a bug', time: '1:30 PM' },
//   {names: 'Anna', issue: 'Need help with an error', time: '1:45 PM' },
// ];

const App = () => {

  const [data, error] = useDbData("cs211", "favouroh1");
  
  const [queue, setQueue] = useState(data);

  // Update the queue state when the data is fetched successfully
  useEffect(() => {
    if (data) {
      setQueue(data);
      }
    }, [data]);
  
  // Conditional rendering for loading and error states
    if (data === undefined) {
      return <div>Loading data...</div>;
    }
  
    if (error) {
      return <div>Error loading data: {error.toString()}</div>;
    }

  // console.log(queue)

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ 
            <div>
              <Link to="/student">Student</Link>
              <br />
              <Link to="/ta">TA</Link>
            </div>
          }/>
          <Route path="/student" element={<Student queue={data}/>} />
          <Route path="/ta" element={<TA />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
