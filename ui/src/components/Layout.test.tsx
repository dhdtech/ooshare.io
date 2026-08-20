import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/render";
import Layout from "./Layout";

describe("Layout", () => {
  it("renders header with wordmark", () => {
    renderWithProviders(<Layout><div>child</div></Layout>);
    expect(screen.getByText("ooshare")).toBeInTheDocument();
  });

  it("renders children", () => {
    renderWithProviders(<Layout><div>test content</div></Layout>);
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  it("renders footer badges", () => {
    renderWithProviders(<Layout><div /></Layout>);
    expect(screen.getByText("AES-256-GCM")).toBeInTheDocument();
    expect(screen.getByText("Zero Knowledge")).toBeInTheDocument();
    expect(screen.getByText("Auto-Delete")).toBeInTheDocument();
  });

  it("renders language selector and security modal trigger", () => {
    renderWithProviders(<Layout><div /></Layout>);
    expect(screen.getByLabelText("Select language")).toBeInTheDocument();
    expect(screen.getByLabelText("How It Works")).toBeInTheDocument();
  });
});
