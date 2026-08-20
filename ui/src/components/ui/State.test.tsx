import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import { ErrorState, LoadingState } from "./State";
import ErrorBanner from "./ErrorBanner";

describe("ErrorBanner", () => {
  it("renders an alert with the message", () => {
    renderWithProviders(<ErrorBanner>Something broke</ErrorBanner>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Something broke");
  });
});

describe("ErrorState", () => {
  it("renders title, message and actions", () => {
    renderWithProviders(
      <ErrorState title="Oops" message="Try again" actions={<button type="button">Retry</button>} />,
    );
    expect(screen.getByRole("heading", { name: "Oops" })).toBeInTheDocument();
    expect(screen.getByText("Try again")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("omits message when absent", () => {
    renderWithProviders(<ErrorState title="Oops" />);
    expect(screen.getByRole("heading", { name: "Oops" })).toBeInTheDocument();
  });
});

describe("LoadingState", () => {
  it("renders a spinner and label", () => {
    renderWithProviders(<LoadingState label="Loading..." />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(document.querySelector(".ui-loading-spinner")).toBeInTheDocument();
  });
});
