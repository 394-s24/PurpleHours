import React from "react";

// The Group component
const Group = ({ names, issue, time }) => {
  return (
    <div className="Group">
      <div className="name">{
        names.reduce((total, name) => {
          return total + " " + name.name + ",";
        },
        "").slice(0, -1)
      }</div>
      <div className="issue">{issue}</div>
      <div className="time">{time}</div>
    </div>
  );
};

export default Group;
