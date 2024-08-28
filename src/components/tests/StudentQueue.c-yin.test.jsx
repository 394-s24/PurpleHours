import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserContext from "../UserContext";
import Student from "../Student";
import * as DatabaseFuncs from "../../DatabaseFuncs";

vi.spyOn(DatabaseFuncs, "useDbData").mockReturnValue([{ groups: {} }, null]);

describe("PurpleHours Test For Charlie Yin", () => {
  test("Click leave from group removes student from group properly", async () => {
    vi.spyOn(DatabaseFuncs, "removeFromGroup").mockImplementation(() => {
      return Promise.resolve();
    });

    const mockUser = { displayName: "John Doe", uid: "12345" };
    const studentData = { course: "cs211" };
    const mockQueue = [
      {
        currentlyHelping: false,
        id: "-NwvTN6oTAnoUwTgawCc",
        issue: "Conceptual: 2ek2",
        names: [
          {
            name: "John Doe",
            uid: "12345",
          },
        ],
        public: true,
        time: "5:42PM, 5/2",
      },
    ];

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUser}>
          <Student queue={mockQueue} studentData={studentData} />
        </UserContext.Provider>
      </BrowserRouter>,
    );

    // Click leave button
    const leaveButton = await screen.findByText("Leave", {
      exact: false,
    });
    fireEvent.click(leaveButton);

    // Check if student is removed from group
    expect(DatabaseFuncs.removeFromGroup).toHaveBeenCalledWith(
      "cs211",
      "12345",
      "-NwvTN6oTAnoUwTgawCc",
    );
  });

  test("Click join group adds student to group properly", async () => {
    vi.spyOn(DatabaseFuncs, "addToGroup").mockImplementation(() => {
      return Promise.resolve();
    });

    const mockUser = { displayName: "John Doe", uid: "12345" };
    const studentData = { course: "cs211" };
    const mockQueue = [
      {
        currentlyHelping: false,
        id: "-NwvTN6oTAnoUwTgawCc",
        issue: "Conceptual: 2ek2",
        names: [
          {
            name: "Jane Doe",
            uid: "54321",
          },
        ],
        public: true,
        time: "5:42PM, 5/2",
      },
    ];

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUser}>
          <Student queue={mockQueue} studentData={studentData} />
        </UserContext.Provider>
      </BrowserRouter>,
    );

    // Click join button
    const joinButton = await screen.findByText("Join", {
      exact: false,
    });
    fireEvent.click(joinButton);

    // Check if student is added to group
    expect(DatabaseFuncs.addToGroup).toHaveBeenCalledWith(
      "cs211",
      "-NwvTN6oTAnoUwTgawCc",
      "John Doe",
      "12345",
    );
  });
});
