import StudentQueue from "./StudentQueue.jsx";
import NewGroup from "./NewGroup.jsx";
import "./Student.css";

import "firebase/database";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useContext } from "react";
import { addToGroup, removeFromGroup } from "../DatabaseFuncs.js";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";

const Student = ({ queue, studentData }) => {
  const [refinedQueue, setRefinedQueue] = useState([]);
  const [modalShow, setModalShow] = useState(false); // State to track modal
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const renderQueue = () => {
    // go back if null data
    if (!studentData) {
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

  const handleJoinQueue = async (studentData, groupId) => {
    await addToGroup(studentData.course, groupId, user.displayName, user.uid);
  };

  const handleLeaveQueue = (studentData, groupID) => {
    removeFromGroup(studentData.course, user.uid, groupID);
  };

  const handleBack = () => {
    navigate("/");
  };
  return (
    <div className="student_view">
      {/* <Button className="go_back_btn" variant="outline-light" onClick={() => handleBack()}>
        Go Back
      </Button> */}
      <div className="queue">
        <Button
          className="go_back_btn"
          variant="outline-light"
          onClick={() => handleBack()}
        >
          Go Back
        </Button>
        <StudentQueue
          queue={refinedQueue}
          studentData={studentData}
          joinQueue={handleJoinQueue}
          leaveQueue={handleLeaveQueue}
        />
      </div>
      <div className="new">
        <Button variant="outline-light" onClick={() => setModalShow(true)}>
          New Group
        </Button>
        {/* Bootstrap modal */}
        <NewGroup
          studentData={studentData}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
    </div>
  );
};

export default Student;
