import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserContext from "../UserContext";
import Student from "./Student";
import App from "../App";
import * as DatabaseFuncs from "../DatabaseFuncs";

vi.spyOn(DatabaseFuncs, "useDbData").mockReturnValue([{ groups: {} }, null]);

describe("PurpleHours Test", () => {
    test("Click ta button brings up TA modal", async () => {
        vi.spyOn(DatabaseFuncs, "signInWithGoogle").mockImplementation(() => {
          const mockUser = { displayName: "Test User", uid: "12345" };
          return Promise.resolve(mockUser);
        });
    
        vi.spyOn(DatabaseFuncs, "useAuthState").mockReturnValue([
          { displayName: "Test User", uid: "12345" },
        ]);
    
        render(<App />);
    
        const tatButton = await screen.findByText("I am a TA/PM", {
          exact: false,
        });
        fireEvent.click(tatButton);
    
        expect(await screen.findByText("Submit")).toBeDefined();
        expect(await screen.findByText("Select a course")).toBeDefined();
        expect(await screen.findByText("Access Code")).toBeDefined();
      });

      test("Click student button brings up Student modal, then with mock input properly redirects to Student page", async () => {
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
        screen.getByText("Currently helping");
      });


});
