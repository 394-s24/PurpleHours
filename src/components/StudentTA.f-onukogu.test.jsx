import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserContext from "../UserContext";
import Student from "./Student";
import TA from "./TA";
import App from "../App";
import * as DatabaseFuncs from "../DatabaseFuncs";

vi.spyOn(DatabaseFuncs, "useDbData").mockReturnValue([{ groups: {} }, null]);

describe("PurpleHours Test", () => {

    test("Student and TA dashboards properly displays respective information", () => {
        // For Student
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
        screen.getByText("New Group");
        screen.getByText("Join");
        expect(screen.queryByText(`Welcome, ${mockUser.displayName}`)).toBeNull(); // only for TA page
    });

    test("Student and TA dashboards properly displays respective information", () => {
        // For TA
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
        // screen.getByText("Help");
        const helpElements = screen.getAllByText("Help");
        expect(helpElements.length).toBeGreaterThan(0);

        expect(screen.queryByText(`We are here to help, ${mockUser.displayName}`)).toBeNull(); // only for Student page
    });

    test("Student and TA dashboards properly displays names dynamically based on user authorization data", async () => {

        // For Student
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
        expect(screen.queryByText("We are here to help, James J")).toBeNull();
    });

    test("Student and TA dashboards properly displays names dynamically based on user authorization data", () => {
        // For TA
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
        expect(screen.queryByText("Welcome, James J")).toBeNull();
    });

});
