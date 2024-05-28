import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./UserContext";
import Student from "./components/Student";
import TA from "./components/TA";
import App from "./App";
import * as DatabaseFuncs from "./DatabaseFuncs.js";

vi.spyOn(DatabaseFuncs, "useDbData").mockReturnValue([{ groups: {} }, null]);

describe("PurpleHours Test", () => {
  test("Should have a Sign in button at start", async () => {
    render(<App />);
    const signInButton = await screen.findByText("Sign in");
    expect(signInButton).toBeDefined();
  });

  test("Should have I am a Student, I am a TA/PM, Sign out buttons after signing in", async () => {
    vi.spyOn(DatabaseFuncs, "signInWithGoogle").mockImplementation(() => {
      const mockUser = { displayName: "Test User", uid: "12345" };
      return Promise.resolve(mockUser);
    });

    vi.spyOn(DatabaseFuncs, "useAuthState").mockReturnValue([
      { displayName: "Test User", uid: "12345" },
    ]);
    render(<App />);

    expect(await screen.findByText("I am a Student")).toBeDefined();
    expect(await screen.findByText("I am a TA/PM")).toBeDefined();
    expect(await screen.findByText("Sign out")).toBeDefined();
  });

  test("Should have Submit and Select a course after clicking I am a Student button", async () => {
    vi.spyOn(DatabaseFuncs, "signInWithGoogle").mockImplementation(() => {
      const mockUser = { displayName: "Test User", uid: "12345" };
      return Promise.resolve(mockUser);
    });

    vi.spyOn(DatabaseFuncs, "useAuthState").mockReturnValue([
      { displayName: "Test User", uid: "12345" },
    ]);

    render(<App />);

    const studentButton = await screen.findByText("I am a Student", {
      exact: false,
    });
    fireEvent.click(studentButton);

    expect(await screen.findByText("Submit")).toBeDefined();
    expect(await screen.findByText("Select a course")).toBeDefined();
  });

  test("Should have Submit, Select a course, and Access Code after clicking I am a TA/PM button", async () => {
    vi.spyOn(DatabaseFuncs, "signInWithGoogle").mockImplementation(() => {
      const mockUser = { displayName: "Test User", uid: "12345" };
      return Promise.resolve(mockUser);
    });

    vi.spyOn(DatabaseFuncs, "useAuthState").mockReturnValue([
      { displayName: "Test User", uid: "12345" },
    ]);

    render(<App />);

    const studentButton = await screen.findByText("I am a TA/PM", {
      exact: false,
    });
    fireEvent.click(studentButton);

    expect(await screen.findByText("Submit")).toBeDefined();
    expect(await screen.findByText("Select a course")).toBeDefined();
    expect(await screen.findByText("Access Code")).toBeDefined();
  });

  test("Should have Sign in after click Sign out button", async () => {
    vi.spyOn(DatabaseFuncs, "signInWithGoogle").mockImplementation(() => {
      const mockUser = { displayName: "Test User", uid: "12345" };
      return Promise.resolve(mockUser);
    });

    vi.spyOn(DatabaseFuncs, "useAuthState").mockReturnValue([
      { displayName: "Test User", uid: "12345" },
    ]);

    render(<App />);

    const signOutButton = await screen.findByText("Sign out", { exact: false });
    fireEvent.click(signOutButton);

    // expect(await screen.findByText("Sign in", { exact: false })).toBeDefined();
  });

  test("Test student queue with items in the queue and currently helping", () => {
    const mockUser = { displayName: "John Doe", uid: "12345" };
    const studentData = { course: "cs211" };
    const mockQueue = [
      {
        "currentlyHelping": true,
        "id": "-NwvTN6oTAnoUwTgawCc",
        "issue": "Conceptual: 2ek2",
        "names": [
          {
            "name": "Jovy Zhou",
            "uid": "xt26DGCDkuNypY7a0zXRnrYsvqs2"
          }
        ],
        "public": true,
        "time": "5:42PM, 5/2"
      },
      {
        "currentlyHelping": false,
        "id": "-NxWQaYd9Bji8xF5zZxA",
        "issue": "Conceptual: 4k3r",
        "names": [
          {
            "name": "John Doe",
            "uid": "12345"
          }
        ],
        "public": true,
        "time": "3:15PM, 5/3"
      },
      {
        "currentlyHelping": false,
        "id": "-NxyJzLQhKjo9Zd6pZvW",
        "issue": "Debugging: 8n2u",
        "names": [
          {
            "name": "Taylor Smith",
            "uid": "zp93JKDLpoNyrT2zVRIqSfa5bK9"
          }
        ],
        "public": true,
        "time": "11:00AM, 5/4"
      }
    ];

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUser}>
          <Student queue={mockQueue} studentData={studentData} />
        </UserContext.Provider>
      </BrowserRouter>
    );

    screen.getByText(`We are here to help, ${mockUser.displayName}`);
    screen.getByText("Join");
    screen.getByText("Leave");
    screen.getByText("Currently helping");
    expect(screen.queryByText("Not helping anyone")).toBeNull();
    expect(screen.queryByText("No groups in the queue")).toBeNull();

    // Click new group button
    const studentButton = screen.getByText("New Group", {
      exact: false,
    });
    fireEvent.click(studentButton);

    // Check if the modal is displayed
    screen.getByText("Submit");
    screen.getByText("What do you need help with?");
    
    // Click submit without filling out info
    const submitButton = screen.getByText("Submit", {
      exact: false,
    });
    fireEvent.click(submitButton);
    screen.getByText("Submit");
  });

  test("Test TA queue with items in the queue and currently helping", () => {
    const mockUser = { displayName: "John Doe", uid: "12345" };
    const dbArgs = { course: "cs211" };
    const mockQueue = [
      {
        "currentlyHelping": true,
        "id": "-NwvTN6oTAnoUwTgawCc",
        "issue": "Conceptual: 2ek2",
        "names": [
          {
            "name": "Jovy Zhou",
            "uid": "xt26DGCDkuNypY7a0zXRnrYsvqs2"
          }
        ],
        "public": true,
        "time": "5:42PM, 5/2",
        "helper": {"name": "John Doe", "uid": "12345"}
      },
      {
        "currentlyHelping": false,
        "id": "-NxWQaYd9Bji8xF5zZxA",
        "issue": "Conceptual: 4k3r",
        "names": [
          {
            "name": "Ben",
            "uid": "45675234624562457"
          }
        ],
        "public": false,
        "time": "3:15PM, 5/3"
      },
      {
        "currentlyHelping": false,
        "id": "-NxyJzLQhKjo9Zd6pZvW",
        "issue": "Debugging: 8n2u",
        "names": [
          {
            "name": "Taylor Smith",
            "uid": "zp93JKDLpoNyrT2zVRIqSfa5bK9"
          }
        ],
        "public": true,
        "time": "11:00AM, 5/4"
      }
    ];

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUser}>
          <TA queue={mockQueue} dbArgs={dbArgs} />
        </UserContext.Provider>
      </BrowserRouter>
    );

    screen.getByText(`Welcome, ${mockUser.displayName}`);
    screen.getByText("Ben");
    screen.getByText("Done");
    screen.getByText("Currently helping");
    expect(screen.queryByText("Not helping anyone")).toBeNull();
    expect(screen.queryByText("No groups in the queue")).toBeNull();
  });
});
