import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "../components/Auth-Components/SignIn";

describe("SignIn component", () => {
    it("should render the SignIn component", () => {
        const { getByTestId } = render(<SignIn />);
        expect(getByTestId("signin-component")).toBeInTheDocument();
    });

    it("should show error message when email is not provided", async () => {
        const { getByTestId, getByLabelText } = render(<SignIn />);
        const emailInput = getByLabelText("Email");
        const passwordInput = getByLabelText("Password");
        const submitButton = getByTestId("signin-submit-button");

        fireEvent.change(emailInput, { target: { value: "" } });
        fireEvent.change(passwordInput, { target: { value: "password" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByTestId("signin-error-message")).toHaveTextContent(
                "Please enter your email address."
            );
        });
    });

    it("should show error message when password is not provided", async () => {
        const { getByTestId, getByLabelText } = render(<SignIn />);
        const emailInput = getByLabelText("Email");
        const passwordInput = getByLabelText("Password");
        const submitButton = getByTestId("signin-submit-button");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByTestId("signin-error-message")).toHaveTextContent(
                "Please enter your password."
            );
        });
    });

    it("should show error message when email and password are incorrect", async () => {
        const { getByTestId, getByLabelText } = render(<SignIn />);
        const emailInput = getByLabelText("Email");
        const passwordInput = getByLabelText("Password");
        const submitButton = getByTestId("signin-submit-button");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByTestId("signin-error-message")).toHaveTextContent(
                "Your login credentials are incorrect."
            );
        });
    });

    it("should show success message when email and password are correct", async () => {
        const { getByTestId, getByLabelText } = render(<SignIn />);
        const emailInput = getByLabelText("Email");
        const passwordInput = getByLabelText("Password");
        const submitButton = getByTestId("signin-submit-button");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByTestId("signin-success-message")).toHaveTextContent(
                "You have successfully signed in."
            );
        });
    });
});
