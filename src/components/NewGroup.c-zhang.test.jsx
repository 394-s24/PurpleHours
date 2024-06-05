import {beforeEach, afterEach, describe, expect, test, vi} from "vitest";
import {fireEvent, render, screen, waitFor, act} from "@testing-library/react";
import NewGroup from "./NewGroup";
import UserContext from "../UserContext";
import * as DatabaseFuncs from "../DatabaseFuncs.js";
import React, {useState} from 'react';

describe("NewGroup Component", () => {
    const mockStudentData = {course: "cs101"};
    const mockUser = {displayName: "John Doe", uid: "123"};
    const mockCreateNewGroup = vi.fn(() => Promise.resolve("groupID"));
    const mockAddToGroup = vi.fn(() => Promise.resolve());
    beforeEach(async () => {
        vi.spyOn(DatabaseFuncs, "createNewGroup").mockImplementation(mockCreateNewGroup);
        vi.spyOn(DatabaseFuncs, "addToGroup").mockImplementation(mockAddToGroup);
    });

    afterEach(async() => {
        vi.restoreAllMocks();
    });

    test("Should create a new group with the correct information", async () => {
        const TestComponent = () => {
            const [show, setShow] = useState(true);
            return (
                <UserContext.Provider value={mockUser}>
                    <NewGroup
                        studentData={mockStudentData}
                        show={show}
                        onHide={() => setShow(false)}
                    />
                </UserContext.Provider>
            );
        };

        render(<TestComponent/>);

        fireEvent.click(await screen.findByText("Private"));
        fireEvent.click(await screen.findByText("Debugging"));
        const help = await screen.findByRole('help-content');
        await act(async () => {
            fireEvent.change(help, {
                target: { value: "Need help debugging my code" },
            });
        });
        await waitFor(async () => {
            expect(help.value).toBe('Need help debugging my code');
        });
        await act(async () => {
            fireEvent.click(await screen.findByText("Submit"));
        });
        await waitFor(() => {
            expect(mockCreateNewGroup).toHaveBeenCalledWith("cs101", {
                issue: "Debugging: Need help debugging my code",
                time: expect.any(Number),
                currentlyHelping: false,
                public: false,
            });
            expect(mockAddToGroup).toHaveBeenCalledWith("cs101", expect.any(String), "John Doe", "123");
        });
    });

    test("Should not create a group if no description is provided", async () => {
        const TestComponent = () => {
            const [show, setShow] = useState(true);
            return (
                <UserContext.Provider value={mockUser}>
                    <NewGroup
                        studentData={mockStudentData}
                        show={show}
                        onHide={() => setShow(false)}
                    />
                </UserContext.Provider>
            );
        };

        render(<TestComponent/>);

        fireEvent.click(await screen.findByLabelText("Conceptual"));
        await act(async () => {
            fireEvent.click(await screen.findByText("Submit"));
        });
        const message = await screen.getByText("Please enter a detailed description of the problem")
        await screen.findByText("Please enter a detailed description of the problem");

        await waitFor(async () => {
            expect(message).to.exist;
            expect(mockCreateNewGroup).not.toHaveBeenCalled();
            expect(mockAddToGroup).not.toHaveBeenCalled();
        });
    });
});
