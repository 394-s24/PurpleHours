import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Spinner, Alert } from "react-bootstrap";

import {
  getUsers,
  getCourses,
  updateTAPermissions,
} from "../../server/database/AdminFuncs";

import useAdminValidation from "../utils/useAdminValidation"; // Custom admin validation hook
import UserContext from "./UserContext"; // User context for authenticated user
import LoadingScreen from "./LoadingScreen"; // Assuming you have a loading screen component
import SignInOutButton from "./SignInOutButton";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [taPermission, setTaPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const user = useContext(UserContext);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    if (user) {
      setLoggedIn(true);
    }
  }, [user]);

  // Only run validation if the user is logged in
  const [validating, isValid] = useAdminValidation(
    loggedIn ? user : null,
    navigate,
  );

  // Fetch users and courses only if admin validation is complete and successful
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await getUsers();
        const fetchedCourses = await getCourses();
        setUsers(fetchedUsers);
        setCourses(fetchedCourses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users or courses:", error);
        setErrorMessage("Failed to load users or courses");
        setLoading(false);
      }
    };

    if (isValid) {
      fetchData();
    }
  }, [isValid]);

  const handleCourseChange = (e) => setSelectedCourse(e.target.value);

  const handleUserChange = (e) => setSelectedUser(e.target.value);

  const handleTAPermissionChange = (e) =>
    setTaPermission(e.target.value === "true");

  const handleUpdateTA = async () => {
    if (!selectedCourse || !selectedUser) {
      setErrorMessage("Please select both a course and a user.");
      return;
    }

    setUpdating(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await updateTAPermissions(selectedUser, selectedCourse, taPermission);
      setSuccessMessage(
        `TA permissions updated successfully to ${taPermission}.`,
      );
    } catch (error) {
      console.error("Error updating TA permissions:", error);
      setErrorMessage("Failed to update TA permissions.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header with Sign In/Out button */}
      <div className="header">
        <h1>Admin Dashboard</h1>
        <SignInOutButton loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      </div>

      {/* Show loading screen if user is logged in but validation is in progress */}
      {validating && loggedIn && <LoadingScreen />}

      {/* Show dashboard content only if the user is logged in and validation is complete */}
      {loggedIn && !validating && (
        <>
          <p>
            Assign or remove Teaching Assistant (TA) permissions for a course
          </p>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form>
            <Form.Group controlId="selectCourse">
              <Form.Label>Select Course</Form.Label>
              <Form.Control
                as="select"
                value={selectedCourse}
                onChange={handleCourseChange}
              >
                <option value="">-- Select a Course --</option>
                {courses.map((course) => (
                  <option key={course.number} value={course.number}>
                    {course.number} - {course.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="selectUser" className="mt-3">
              <Form.Label>Select User</Form.Label>
              <Form.Control
                as="select"
                value={selectedUser}
                onChange={handleUserChange}
              >
                <option value="">-- Select a User --</option>
                {users.map((user) => (
                  <option key={user.uid} value={user.uid}>
                    {user.displayName} ({user.email})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="taPermission" className="mt-3">
              <Form.Label>Set TA Permission</Form.Label>
              <Form.Control
                as="select"
                value={taPermission}
                onChange={handleTAPermissionChange}
              >
                <option value={true}>Grant TA Permission</option>
                <option value={false}>Remove TA Permission</option>
              </Form.Control>
            </Form.Group>

            <Button
              variant="success"
              className="mt-4"
              onClick={handleUpdateTA}
              disabled={updating || !selectedCourse || !selectedUser}
            >
              {updating ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "Update TA Permissions"
              )}
            </Button>
          </Form>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
