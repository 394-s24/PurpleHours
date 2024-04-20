import "./App.css";
import Student from "./components/Student.jsx";
import TA from "./components/TA.jsx";
import Landing from "./components/Landing.jsx";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDbData, useAuthState } from "./DatabaseFuncs.mjs";
import UserContext from "./UserContext.jsx";

import "firebase/database";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [dbArgs, setDbArgs] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [data, error] = useDbData(dbArgs);
  const [user] = useAuthState();

  // Placeholder student data
  useEffect(() => {
    setStudentData({
      name: user ? user.displayName : null, // user also has unique id via user.uid
      course: "cs211",
    });
  }, [user]);

  // Placeholder db args
  useEffect(() => {
    setDbArgs("cs211");
  }, []);

  if (data === undefined) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.toString()}</div>;
  }

  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Landing
                  setStudentData={setStudentData}
                  setDbArgs={setDbArgs}
                />
              }
            />
            <Route
              path="/student"
              element={<Student queue={data} studentData={studentData} />}
            />
            <Route path="/ta" element={<TA queue={data} dbArgs={dbArgs} />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
};

export default App;
