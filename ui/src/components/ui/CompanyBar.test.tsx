import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import { CompanyBar } from "./CompanyBar";

const year = new Date().getFullYear();

describe("CompanyBar", () => {
  it("renders the ooshare copyright with the current year", () => {
    renderWithProviders(<CompanyBar />);
    expect(
      screen.getByText(`© ${year} ooshare.io. All rights reserved.`),
    ).toBeInTheDocument();
  });

  it("renders the DHDTech.io location with the company name as a link", () => {
    renderWithProviders(<CompanyBar />);
    // The center piece is now a linked "DHDTech.io" anchor followed by the
    // plain (translated) "· Sheridan, Wyoming" location text.
    const nameLink = screen.getByRole("link", { name: "DHDTech.io" });
    expect(nameLink).toHaveAttribute("class", "ui-company-location-link");
    expect(nameLink).toHaveAttribute("href", "https://dhdtech.io");
    expect(nameLink).toHaveAttribute("target", "_blank");
    expect(nameLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("· Sheridan, Wyoming")).toBeInTheDocument();
  });

  it("renders a Powered by link to dhdtech.io with the DHD logo", () => {
    renderWithProviders(<CompanyBar />);
    // Two links now carry the "DHDTech.io" name (the center location name and
    // this powered-by credit); the powered-by one is the one with the logo.
    // The logo's alt equals the label, so the name is announced once via alt
    // and once via text.
    const link = screen
      .getAllByRole("link", { name: /DHDTech\.io/ })
      .find((el) => el.querySelector("img"));
    expect(link).toBeDefined();
    expect(link).toHaveAttribute("href", "https://dhdtech.io");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    const logo = screen.getByAltText("DHDTech.io");
    expect(logo).toHaveAttribute("src", "/dhdtech-logo.png");
    expect(logo).toHaveAttribute("width", "16");
    expect(logo).toHaveAttribute("height", "16");
  });

  it("labels the credit as Powered by", () => {
    renderWithProviders(<CompanyBar />);
    expect(screen.getByText("Powered by")).toBeInTheDocument();
  });
});
