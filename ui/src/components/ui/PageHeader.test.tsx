import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import PageHeader from "./PageHeader";
import SectionHeader from "./SectionHeader";

describe("PageHeader", () => {
  it("renders h1 title and subtitle", () => {
    renderWithProviders(<PageHeader title="Share secrets" subtitle="End-to-end encrypted" />);
    expect(screen.getByRole("heading", { level: 1, name: "Share secrets" })).toBeInTheDocument();
    expect(screen.getByText("End-to-end encrypted")).toBeInTheDocument();
  });

  it("omits subtitle when absent", () => {
    renderWithProviders(<PageHeader title="Only title" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

describe("SectionHeader", () => {
  it("renders h2 title and optional sub", () => {
    renderWithProviders(<SectionHeader title="How it works" sub="Three steps" />);
    expect(screen.getByRole("heading", { level: 2, name: "How it works" })).toBeInTheDocument();
    expect(screen.getByText("Three steps")).toBeInTheDocument();
  });

  it("omits sub when absent", () => {
    renderWithProviders(<SectionHeader title="Title" />);
    expect(screen.queryByText("Three steps")).not.toBeInTheDocument();
  });
});
