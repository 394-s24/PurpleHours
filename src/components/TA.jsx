import TAQueue from "./TAQueue.jsx";
import UserContext from "../UserContext.jsx";
import "./TA.css";
import "firebase/database";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { removeGroup, setGroupHelping } from "../DatabaseFuncs.js";

const TA = ({ queue, dbArgs }) => {
  const [refinedQueue, setRefinedQueue] = useState([]);
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const renderQueue = () => {
    // go back if null data
    if (!dbArgs) {
      navigate("/");
      return;
    }

    // Checks if queue is defined
    if (!queue) {
      setRefinedQueue([]);
      return;
    }

    // Format queue data
    const formattedQueue = Object.values(queue).map((item) => {
      // Convert unix time to readable time with specific format: "4:10PM, 3/27"
      const unixTimestamp = item.time;
      const date = new Date(unixTimestamp * 1000);
      let hours = date.getHours();
      const minutes = "0" + date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const month = date.getMonth() + 1; // Months are zero indexed, so add 1
      const day = date.getDate();
      const formattedTime = isNaN(date.getTime())
        ? "Invalid Date"
        : `${hours}:${minutes.substr(-2)}${ampm}, ${month}/${day}`;

      // Convert list of names to string
      const namesObjects = item["names"];
      let namesArray = ["No members"];
      if (namesObjects) {
        namesArray = Object.values(namesObjects).map((obj) => {
          return {
            name: obj["name"],
            uid: obj["uid"],
          };
        });
      }

      // Return a new object with formatted time and names
      return {
        ...item,
        time: formattedTime,
        names: namesArray,
      };
    });

    // Update state
    setRefinedQueue(formattedQueue);
  };

  useEffect(renderQueue, [queue]);

  const handleDone = (groupId) => {
    // Logic for removing the done group from the database
    removeGroup(dbArgs, groupId);
  };

  const handleHelping = (groupId) => {
    // Logic for setting a gorup to be currently helping in the database
    setGroupHelping(dbArgs, groupId, user);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="queue">
        <Button
          className="go-back-btn"
          variant="outline-light"
          onClick={() => handleBack()}
        >
          Go Back
        </Button>
        <TAQueue
          queue={refinedQueue}
          handleDone={handleDone}
          handleHelping={handleHelping}
        />
      </div>
    </div>
  );
};

export default TA;
