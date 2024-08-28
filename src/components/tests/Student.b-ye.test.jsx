import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserContext from "../UserContext";
import Student from "../Student";
import * as DatabaseFuncs from "../../DatabaseFuncs";

vi.spyOn(DatabaseFuncs, "useDbData").mockReturnValue([{ groups: {} }, null]);

describe("PurpleHours Test", () => {
  test("Student queue displays empty data properly", () => {
    const mockUser = { displayName: "John Doe", uid: "12345" };
    const studentData = { course: "cs211" };
    const mockQueue = [];

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUser}>
          <Student queue={mockQueue} studentData={studentData} />
        </UserContext.Provider>
      </BrowserRouter>,
    );

    // empty data
    screen.getByText("Not helping anyone");
    screen.getByText("No groups in the queue");

    // data (shouldn't display)
    expect(screen.queryByText("Join")).toBeNull();
    expect(screen.queryByText("Private")).toBeNull();
    expect(screen.queryByText("Leave")).toBeNull();
    expect(screen.queryByText("Being helped by:")).toBeNull();
  });

  test("Student queue displays data with users properly", () => {
    const mockUser = { displayName: "John Doe", uid: "12345" };
    const studentData = { course: "cs211" };
    const mockQueue = [
      {
        currentlyHelping: true,
        helper: {
          name: "Helper Helper",
          uid: "999",
        },
        id: "-aaa",
        issue: "Conceptual: helped right now",
        names: [
          {
            name: "Alice Alice",
            uid: "1",
          },
        ],
        public: true,
        time: "11:00AM, 6/2",
      },
      {
        currentlyHelping: false,
        id: "-bbb",
        issue: "Conceptual: in queue public",
        names: [
          {
            name: "Bob Bob",
            uid: "2",
          },
        ],
        public: true,
        time: "11:15AM, 6/2",
      },
      {
        currentlyHelping: false,
        id: "-ccc",
        issue: "Debugging: in queue private",
        names: [
          {
            name: "Trudy Trudy",
            uid: "3",
          },
        ],
        public: false,
        time: "11:17AM, 6/2",
      },
      {
        currentlyHelping: false,
        id: "-ddd",
        issue: "Debugging: in queue me",
        names: [
          {
            name: "John Doe",
            uid: "12345",
          },
        ],
        public: true,
        time: "12:00PM, 6/2",
      },
    ];

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUser}>
          <Student queue={mockQueue} studentData={studentData} />
        </UserContext.Provider>
      </BrowserRouter>,
    );

    // currently helped
    screen.getByText("Alice Alice");
    screen.getByText("Conceptual: helped right now");
    screen.getByText("Being helped by: Helper Helper");

    // joinable group
    screen.getByText("Join");
    screen.getByText("Bob Bob");
    screen.getByText("Conceptual: in queue public");

    // private group
    screen.getByText("Private");
    screen.getByText("Trudy Trudy");
    screen.getByText("Debugging: in queue private");

    // group you're in
    screen.getByText("Leave");
    screen.getByText("John Doe");
    screen.getByText("Debugging: in queue me");

    // empty data (shouldn't display)
    expect(screen.queryByText("Not helping anyone")).toBeNull();
    expect(screen.queryByText("No groups in the queue")).toBeNull();
  });
});
