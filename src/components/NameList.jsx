import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { getUserHelpCounts } from "../../server/database/UserFuncs.js";

import "./NameList.css";

// Define 4 balanced shades of purple based on the help count ranges
const helpCountColors = [
  "#B88FD4", // 0-3 Helps - Light Purple
  "#9A6AB3", // 4-7 Helps - Medium Purple
  "#784497", // 8-12 Helps - Dark Purple
  "#55297C", // 13+ Helps - Very Dark Purple
];

const NameList = ({ names, course }) => {
  const [helpCounts, setHelpCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState(true); // Track loading state

  useEffect(() => {
    const fetchHelpCounts = async () => {
      setLoadingCounts(true); // Set loading to true before fetching
      const counts = await getUserHelpCounts(names, course);
      setHelpCounts(counts);
      setLoadingCounts(false); // Set loading to false after fetching
    };

    if (names.length > 0) {
      fetchHelpCounts();
    }
  }, [names]);

  // Function to determine the color based on help count
  const getColorByHelpCount = (helpCount) => {
    if (helpCount <= 3) return helpCountColors[0];
    if (helpCount <= 7) return helpCountColors[1];
    if (helpCount <= 12) return helpCountColors[2];
    return helpCountColors[3];
  };

  return (
    <div className="names-list">
      {names.map((nameObj, index) => (
        <span key={`${nameObj.uid}-${index}`} className="name-item">
          <span className="name-text">{nameObj.name}</span>
          <span
            className="help-count"
            style={{
              backgroundColor: loadingCounts ? "#784497" : getColorByHelpCount(helpCounts[nameObj.uid] || 0), // Determine color based on help count
              display: "inline-block",
              width: "20px",
              height: "20px",
              textAlign: "center",
              borderRadius: "4px",
              marginLeft: "8px",
              color: "white",
            }}
          >
            {loadingCounts ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              helpCounts[nameObj.uid] || 0
            )}
          </span>
          {index < names.length - 1 && ", "}
        </span>
      ))}
    </div>
  );
};

export default NameList;
