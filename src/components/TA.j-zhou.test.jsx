import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserContext from "../UserContext";
import TA from "./TA";
import * as DatabaseFuncs from "../DatabaseFuncs";

vi.spyOn(DatabaseFuncs, "useDbData").mockReturnValue([{ groups: {} }, null]);

describe("PurpleHours Test", () => {

  test("TA queue displays empty data properly", () => {
    const mockUser = { displayName: "John Doe", uid: "12345" };
    const dbArgs = { course: "cs211" };
    const mockQueue = [];

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUser}>
          <TA queue={mockQueue} dbArgs={dbArgs} />
        </UserContext.Provider>
      </BrowserRouter>
    );
    
    // empty data
    screen.getByText("Not helping anyone");
    screen.getByText("No groups in the queue");
    screen.getByText("Go Back");

    // data (shouldn't display)
    expect(screen.queryByText("Help")).toBeNull();
    expect(screen.queryByText("Being helped by:")).toBeNull();
  });

  test("TA queue displays data with users properly", () => {
    const mockUser = { displayName: "John Doe", uid: "12345" };
    const dbArgs = { course: "cs211" };
    const mockQueue = [
      {
        "currentlyHelping": true,
        "helper": {
          "name": "John Doe",
          "uid": "12345"
        },
        "id": "1",
        "issue": "Conceptual: Help me with pointers",
        "names": [
          {
            "name": "Alice in Wonderland",
            "uid": "1"
          }
        ],
        "public": true,
        "time": "11:00AM, 6/2"
      },
      {
        "currentlyHelping": false,
        "id": "2",
        "issue": "Conceptual: Can't understand stack and heap",
        "names": [
          {
            "name": "Bob the Builder",
            "uid": "2"
          }
        ],
        "public": true,
        "time": "11:15AM, 6/2"
      },
      {
        "currentlyHelping": false,
        "id": "3",
        "issue": "Debugging: My code no work",
        "names": [
          {
            "name": "Dantes",
            "uid": "3"
          }
        ],
        "public": false,
        "time": "11:17AM, 6/2"
      },
      {
        "currentlyHelping": false,
        "id": "4",
        "issue": "Debugging: in queue me",
        "names": [
          {
            "name": "Jack Ma",
            "uid": "4"
          }
        ],
        "public": true,
        "time": "12:00PM, 6/2"
      }
    ];

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUser}>
          <TA queue={mockQueue} dbArgs={dbArgs} />
        </UserContext.Provider>
      </BrowserRouter>
    );

    // currently helped and done button
    screen.getByText("Alice in Wonderland");
    screen.getByText("Conceptual: Help me with pointers");
    screen.getByText("Being helped by: John Doe");
    screen.getByText("Done");
    
    // help button 
    screen.getAllByText("Help");
    screen.getByText("Bob the Builder");
    screen.getByText("Conceptual: Can't understand stack and heap");

    // empty data (shouldn't display)
    expect(screen.queryByText("Not helping anyone")).toBeNull();
    expect(screen.queryByText("No groups in the queue")).toBeNull();
  });
});
