import { it, vi, describe, afterEach, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDbData, useAuthState } from "../DatabaseFuncs";

import App from "../App";

vi.mock("../DatabaseFuncs.js");

describe("PurpleHours Test", () => {
  const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

  afterEach(() => {
    mockAlert.mockClear();
  });

  it("Should not let user in after entering incorrect access code", () => {
    useDbData.mockReturnValue([[], null]);
    useAuthState.mockReturnValue([{ displayName: "Test User", uid: "12345" }]);
    render(<App />);

    // Navigate to TA modal
    fireEvent.click(screen.getByText(/I am a TA\/PM/));
    screen.getByText(/Join Office Hours/);

    // Enter incorrect access code
    fireEvent.change(screen.getByText(/Select a course/), {
      target: {
        value: "cs211",
      },
    });
    screen.getByText(/CS 211/);

    fireEvent.change(screen.getByPlaceholderText(/1234/), {
      target: {
        value: "0000",
      },
    });

    fireEvent.click(screen.getByText(/Submit/));

    // Check if an alert is shown
    expect(mockAlert).toHaveBeenCalledOnce();
    expect(mockAlert).toHaveBeenCalledWith("Incorrect access code");
  });

  it("Should let user in after entering correct access code", () => {
    useDbData.mockReturnValue([[], null]);
    useAuthState.mockReturnValue([{ displayName: "Test User", uid: "12345" }]);
    render(<App />);

    // Navigate to TA modal
    fireEvent.click(screen.getByText(/I am a TA\/PM/));
    screen.getByText(/Join Office Hours/);

    // Enter correct access code
    fireEvent.change(screen.getByText(/Select a course/), {
      target: {
        value: "cs211",
      },
    });
    screen.getByText(/CS 211/);

    fireEvent.change(screen.getByPlaceholderText(/1234/), {
      target: {
        value: "1234",
      },
    });

    fireEvent.click(screen.getByText(/Submit/));

    // Check if an alert is not shown
    expect(mockAlert).not.toHaveBeenCalled();

    // Check if user was navigated to the TA page
  });
});
