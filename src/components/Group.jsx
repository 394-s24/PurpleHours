import React from "react";

// The Group component
const Group = ({ names, issue, time, helper }) => {
  return (
    <div className="Group">
      <div className="name">
        {names
          .reduce((total, name) => {
            return total + " " + name.name + ",";
          }, "")
          .slice(0, -1)}
      </div>
      <div className="issue">{issue}</div>
      <div className="time">{time}</div>
      {helper && (
        <div className="helper">
          <p>Being helped by: {helper.name}</p>
        </div>
      )}
    </div>
  );
};

export default Group;
