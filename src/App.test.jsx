import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

  test("Name matches logged-in user", () => {});
});
