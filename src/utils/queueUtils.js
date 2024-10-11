// queueUtils.js
export const formatQueue = (queue) => {
  if (!queue) return [];

  return Object.values(queue).map((item) => {
    const unixTimestamp = item.time; // Original Unix timestamp
    const date = new Date(unixTimestamp * 1000);
    let hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedTime = isNaN(date.getTime())
      ? "Invalid Date"
      : `${hours}:${minutes.substr(-2)}${ampm}, ${month}/${day}`;

    const namesObjects = item["names"];
    let namesArray = ["No members"];
    if (namesObjects) {
      namesArray = Object.values(namesObjects).map((obj) => ({
        name: obj["name"],
        uid: obj["uid"],
        helpCount: obj["helpCount"],
      }));
    }

    return {
      ...item,
      time: formattedTime,       // Formatted time for display
      originalTime: unixTimestamp, // Keep original timestamp for sorting
      names: namesArray,
    };
  });
};
