import React from 'react';

// The Group component
const Group = ({ name, issue, time }) => {
  return (
    <div className="Group">
      <div className="name">{name}</div>
      <div className="issue">{issue}</div>
      <div className="time">{time}</div>
    </div>
  );
};

export default Group;