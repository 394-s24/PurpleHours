import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { initializeUserIfNeeded } from "../server/database/UserFuncs.js";
import { useAuthState } from "../server/database/AuthFuncs.js";

import Landing from "./components/Landing.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Student from "./components/Student.jsx";
import TA from "./components/TA.jsx";
import UserContext from "./components/UserContext.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [user] = useAuthState();

  useEffect(() => {
    if (user) {
      initializeUserIfNeeded(user.uid, user.displayName);
    }
  }, [user]);

  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <BrowserRouter>
          <Routes>
            <Route path="/:course" element={<Student />} />
            <Route path="/:course/ta" element={<TA />} />
            <Route path="/" element={<Landing />} />
            <Route path="/404" element={<ErrorPage message={"Course Not Found"}/>} />
            <Route path="*" element={<ErrorPage message={"Page Not Found"}/>} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
};

export default App;
