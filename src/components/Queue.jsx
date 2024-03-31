import React from 'react';
import Group from './Group';

// The Queue component
const Queue = ({ queue }) => {
    return (
      <div className="queue">
        {queue.map((group, index) => (
          <Group
            key={index}
            name={group.name}
            issue={group.issue}
            time={group.time}
          />
        ))}
      </div>
    );
  };

// const Group = ({ name, issue, time }) => {
//   return (
//     <div className="Group">
//       <div className="name">{name}</div>
//       <div className="issue">{issue}</div>
//       <div className="time">{time}</div>
//     </div>
//   );
// };

export default Queue;