import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import StepsList from "./StepsList";

describe("StepsList", () => {
  const steps = [
    { title: "Write", body: "Encrypted locally.", tag: "encrypted locally" },
    { title: "Share", body: "Key in fragment." },
  ];

  it("renders zero-padded mono step numbers", () => {
    renderWithProviders(<StepsList steps={steps} />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
  });

  it("renders step titles, bodies and optional tags", () => {
    renderWithProviders(<StepsList steps={steps} />);
    expect(screen.getByText("Write")).toBeInTheDocument();
    expect(screen.getByText("Encrypted locally.")).toBeInTheDocument();
    expect(screen.getByText("encrypted locally")).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(screen.getByText("Key in fragment.")).toBeInTheDocument();
  });

  it("renders as an ordered list", () => {
    const { container } = renderWithProviders(<StepsList steps={steps} />);
    expect(container.querySelector("ol.ui-steps-list")).not.toBeNull();
  });
});
