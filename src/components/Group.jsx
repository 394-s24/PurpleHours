// Group.jsx
import "./Group.css";
import NameList from "./NameList";
import { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";

const Group = ({ names, issue, time, online, helper }) => {

  return (
    <div className="Group">
      <div className="name">
        {/* {names
          .reduce((total, name) => {
            return total + " " + name.name + ",";
          }, "")
          .slice(0, -1)} */}
          <NameList names={names} />
      </div>
      <div className="issue">{issue}</div>
      <div className="time">{time}</div>
      {helper && (
        <div className="helper">
          Being helped by: <span className="helper-name">{helper.name}</span>
        </div>
      )}
      <div className={`online ${online ? "online-status" : "in-person-status"}`}>
        {online ? "Online" : "In-Person"}
      </div>
    </div>
  );
};

export default Group;
