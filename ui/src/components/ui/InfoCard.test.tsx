import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Lock } from "lucide-react";
import { renderWithProviders } from "../../test/render";
import InfoCard from "./InfoCard";

describe("InfoCard", () => {
  it("renders icon, title, body and tag", () => {
    renderWithProviders(
      <InfoCard icon={<Lock size={19} />} title="Encrypted" tag="AES-256-GCM">
        Runs in your browser.
      </InfoCard>,
    );
    expect(screen.getByRole("heading", { name: "Encrypted" })).toBeInTheDocument();
    expect(screen.getByText("Runs in your browser.")).toBeInTheDocument();
    expect(screen.getByText("AES-256-GCM")).toBeInTheDocument();
    expect(document.querySelector(".ui-info-card-icon svg")).toBeInTheDocument();
  });

  it("omits tag when absent", () => {
    renderWithProviders(<InfoCard icon={<Lock size={19} />} title="Title">Body</InfoCard>);
    expect(screen.queryByText("AES-256-GCM")).not.toBeInTheDocument();
  });

  it("renders trusted HTML body via the html prop", () => {
    renderWithProviders(
      <InfoCard icon={<Lock size={19} />} title="Encrypted" html="Runs <strong>locally</strong>.">
        Plain body ignored.
      </InfoCard>,
    );
    expect(document.querySelector(".ui-info-card-body strong")).toHaveTextContent("locally");
    expect(screen.queryByText("Plain body ignored.")).not.toBeInTheDocument();
  });

  it("renders no body paragraph when neither children nor html is given", () => {
    renderWithProviders(<InfoCard icon={<Lock size={19} />} title="Title" />);
    expect(document.querySelector(".ui-info-card-body")).not.toBeInTheDocument();
  });
});
