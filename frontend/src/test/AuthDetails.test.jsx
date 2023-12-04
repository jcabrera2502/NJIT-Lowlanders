import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthDetails from "../components/Auth-Components/AuthDetails";

describe("AuthDetails component", () => {
    test("renders login button when user is not authenticated", () => {
        render(<AuthDetails />);
        const loginButton = screen.getByRole("button", { name: /login/i });
        expect(loginButton).toBeInTheDocument();
    });

    test("renders logout button when user is authenticated", async () => {
        const mockUser = { uid: "123" };
        const mockOnAuthStateChanged = jest.fn((cb) => cb(mockUser));
        jest.spyOn(auth, "onAuthStateChanged").mockImplementation(mockOnAuthStateChanged);

        render(<AuthDetails />);
        const logoutButton = screen.getByRole("button", { name: /logout/i });
        expect(logoutButton).toBeInTheDocument();

        userEvent.click(logoutButton);
        await waitFor(() => expect(mockOnAuthStateChanged).toHaveBeenCalledTimes(2));
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });
});
