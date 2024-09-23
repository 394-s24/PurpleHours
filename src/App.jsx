import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useAuthState } from "../server/database/AuthFuncs.js";

import Landing from "./components/Landing.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Student from "./components/Student.jsx";
import TA from "./components/TA.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import UserContext from "./components/UserContext.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [user] = useAuthState();

  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <BrowserRouter>
          <Routes>
            <Route path="/:course" element={<Student />} />
            <Route path="/:course/ta" element={<TA />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/" element={<Landing />} />
            <Route path="/404" element={<ErrorPage message={"Course Not Found"}/>} />
            <Route path="/invalid-ta" element={<ErrorPage message={"You do not have TA permissions!"}/>} />
            <Route path="/not-authorized" element={<ErrorPage message={"You do not have admin permissions!"}/>} />
            <Route path="*" element={<ErrorPage message={"Page Not Found"}/>} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
};

export default App;
