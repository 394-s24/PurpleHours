// import { it, vi, describe, afterEach, expect, beforeEach } from "vitest";
// import { render, screen, fireEvent } from "@testing-library/react";
// import { useDbData, useAuthState } from "../../DatabaseFuncs";

// import App from "../../App";

// vi.mock("../DatabaseFuncs.js");

// const navigate = vi.fn();
// vi.mock("react-router-dom", async () => {
//   const mod = await vi.importActual("react-router-dom");
//   return {
//     ...mod,
//     useNavigate: () => navigate,
//   };
// });

// describe("PurpleHours Test", () => {
//   const alert = vi.spyOn(window, "alert").mockImplementation(() => {});

//   beforeEach(() => {
//     useDbData.mockReturnValue([[], null]);
//     useAuthState.mockReturnValue([{ displayName: "Test User", uid: "12345" }]);
//   });

//   afterEach(() => {
//     alert.mockClear();
//     navigate.mockClear();
//   });

//   it("Should not let user in after entering incorrect access code", () => {
//     render(<App />);

//     // Navigate to TA modal
//     fireEvent.click(screen.getByText(/I am a TA\/PM/));
//     screen.getByText(/Join Office Hours/);

//     // Enter incorrect access code
//     fireEvent.change(screen.getByText(/Select a course/), {
//       target: {
//         value: "cs211",
//       },
//     });
//     screen.getByText(/CS 211/);

//     fireEvent.change(screen.getByPlaceholderText(/1234/), {
//       target: {
//         value: "0000",
//       },
//     });

//     fireEvent.click(screen.getByText(/Submit/));

//     // Check if an alert is shown
//     expect(alert).toHaveBeenCalledOnce();
//     expect(alert).toHaveBeenCalledWith("Incorrect access code");

//     // Check if user was not navigated
//     expect(navigate).not.toHaveBeenCalled();
//   });

//   it("Should let user in after entering correct access code", () => {
//     render(<App />);

//     // Navigate to TA modal
//     fireEvent.click(screen.getByText(/I am a TA\/PM/));
//     screen.getByText(/Join Office Hours/);

//     // Enter correct access code
//     fireEvent.change(screen.getByText(/Select a course/), {
//       target: {
//         value: "cs211",
//       },
//     });
//     screen.getByText(/CS 211/);

//     fireEvent.change(screen.getByPlaceholderText(/1234/), {
//       target: {
//         value: "1234",
//       },
//     });

//     fireEvent.click(screen.getByText(/Submit/));

//     // Check if an alert is not shown
//     expect(alert).not.toHaveBeenCalled();

//     // Check if user was navigated to the TA page
//     expect(navigate).toHaveBeenCalledOnce();
//     expect(navigate).toHaveBeenCalledWith("/ta");
//   });
// });
