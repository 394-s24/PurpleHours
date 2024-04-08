import './App.css';
import Student from './components/Student';
import TA from './components/TA';
import Landing from './components/Landing';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDbData } from './DatabaseFuncs.mjs';

import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [dbArgs, setDbArgs] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [data, error] = useDbData(dbArgs[0], dbArgs[1]);

  // Placeholder student data
  useEffect(() => {
    setStudentData({
      name: 'Jack',
      course: 'cs211',
      session: 'favouroh1',
    });
  }, []);

  // Placeholder db args
  useEffect(() => {
    setDbArgs(['cs211', 'favouroh1']);
  }, []);

  if (data === undefined) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.toString()}</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Landing setStudentData={setStudentData} setDbArgs={setDbArgs} />
            }
          />
          <Route
            path="/student"
            element={<Student queue={data} studentData={studentData} />}
          />
          <Route path="/ta" element={<TA queue={data} dbArgs={dbArgs} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
