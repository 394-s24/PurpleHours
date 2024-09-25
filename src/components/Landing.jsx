import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCourses } from "../../server/database/AdminFuncs"; // Adjust this path based on your project structure

import LoadingScreen from "./LoadingScreen";

import "./Landing.css";

const Landing = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const allCourses = await getCourses();
        const activeCourses = allCourses.filter((course) => course.active); // Assuming 'active' is part of course object
        setCourses(activeCourses);
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Handle navigation to the selected course
  const handleNavigate = (courseNumber) => {
    navigate(`/${courseNumber}`);
  };

  return (
    <div className="landing">
      {isLoading && <LoadingScreen />}
      {!isLoading && <>
        <h2>Select a course to start:</h2>
        <div className="courses-list">
          {courses.length > 0 ? (
            courses.map((course) => (
              <button
                key={course.number}
                className="course-btn"
                onClick={() => handleNavigate(course.number)}
              >
                {course.number.toUpperCase()} - {course.name}
              </button>
            ))
          ) : (
            <p>No active courses available</p>
          )}
        </div>
      </>}
    </div>
  );
};

export default Landing;
