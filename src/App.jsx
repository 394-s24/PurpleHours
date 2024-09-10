import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { initializeUserIfNeeded } from "../server/database/UserFuncs.js";
import { useAuthState } from "../server/database/AuthFuncs.js";

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
            <Route path="/ta/:course" element={<TA />} />
            <Route path="/404" element={<div>404 - Course Not Found</div>} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
};

export default App;
