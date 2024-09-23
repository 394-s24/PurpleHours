import { Spinner } from "react-bootstrap";

import "./Group.css";
import NameList from "./NameList";

const Group = ({ names, issue, time, online, helper, loading, course }) => {
  return (
    <div className={`Group ${loading ? "loading" : ""}`}>
      {loading ? (
        <Spinner as="span" animation="border" size="lg" />
      ) : (
        <>
          <div className="name">
            <NameList names={names} course={course} />
          </div>
          <div className="issue">{issue}</div>
          <div className="time">{time}</div>
          {helper && (
            <div className="helper">
              Being helped by: <span className="helper-name">{helper.name}</span>
            </div>
          )}
          <div
            className={`online ${online ? "online-status" : "in-person-status"}`}
          >
            {online ? "Online" : "In-Person"}
          </div>
        </>
      )}
    </div>
  );
};

export default Group;
