import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { initializeUserIfNeeded } from "../server/database/UserFuncs.js";
import { useDbData } from "../server/database/DataHooks.js";
import { useAuthState } from "../server/database/AuthFuncs.js";

import Student from "./components/Student.jsx";
import TA from "./components/TA.jsx";
import Landing from "./components/Landing.jsx";
import UserContext from "./components/UserContext.jsx";

import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

const App = () => {
  const [dbArgs, setDbArgs] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [data, error] = useDbData(dbArgs);
  const [user] = useAuthState();

  useEffect(() => {
    if (user) {
      initializeUserIfNeeded(user.uid, user.displayName);
    }
  }, [user]);

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
              element={<Student studentData={studentData} />}
            />
            <Route path="/ta" element={<TA dbArgs={dbArgs} />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
};

export default App;
