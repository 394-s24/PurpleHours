import './App.css';
import Student from './components/Student.jsx';
import TA from './components/TA.jsx';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useDbData } from './DatabaseFuncs.mjs';

import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

  const [data, error] = useDbData("cs211", "favouroh1");
  console.log(data);
  if (data === undefined) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.toString()}</div>;
  }

  return(
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ 
            <div>
              <Link to="/student">Student</Link>
              <br />
              <Link to="/ta">TA</Link>
            </div>
          }/>
          <Route path="/student" element={<Student queue={data}/>} />
          <Route path="/ta" element={<TA queue={data}/>} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
