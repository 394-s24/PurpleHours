import { useState, useEffect } from "react";

import { getUserHelpCounts } from "../../server/database/UserFuncs.js";

import "./NameList.css";

const pastelColors = [
  "#D9534F", // Darker Pink/Red
  "#F0AD4E", // Darker Orange
  "#FFD700", // Darker Yellow/Gold
  "#5CB85C", // Darker Green
  "#5BC0DE", // Darker Blue/Cyan
];

const NameList = ({ names }) => {
  const [helpCounts, setHelpCounts] = useState({});

  useEffect(() => {
    const fetchHelpCounts = async () => {
      const counts = await getUserHelpCounts(names);
      setHelpCounts(counts);
    };

    if (names.length > 0) {
      fetchHelpCounts();
    }
  }, [names]);

  const getColorByIndex = (index) => {
    return pastelColors[index % pastelColors.length]; // Cycle through colors
  };

  return (
    <div className="names-list">
      {names.map((nameObj, index) => (
        <span key={nameObj.uid} className="name-item">
          <span className="name-text">{nameObj.name}</span>
          <span
            className="help-count"
            style={{
              backgroundColor: getColorByIndex(index), // Use color based on index
              display: "inline-block",
              width: "20px",
              height: "20px",
              textAlign: "center",
              borderRadius: "4px",
              marginLeft: "8px",
              color: "white", // Ensuring white text for better contrast
            }}
          >
            {helpCounts[nameObj.uid] || 0}
          </span>
          {index < names.length - 1 && ", "}
        </span>
      ))}
    </div>
  );
};

export default NameList;
