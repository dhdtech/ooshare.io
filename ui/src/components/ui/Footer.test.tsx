import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Lock } from "lucide-react";
import { renderWithProviders } from "../../test/render";
import { FooterBadges, FooterNav, FooterLegal } from "./Footer";

const badges = [
  { label: "AES-256-GCM", icon: <Lock size={12} /> },
  { label: "Zero Knowledge", icon: <Lock size={12} /> },
];

const links = [
  { to: "/security", label: "Security" },
  { to: "/faq", label: "FAQ" },
];

describe("FooterBadges", () => {
  it("renders each badge label", () => {
    renderWithProviders(<FooterBadges badges={badges} />);
    expect(screen.getByText("AES-256-GCM")).toBeInTheDocument();
    expect(screen.getByText("Zero Knowledge")).toBeInTheDocument();
  });
});

describe("FooterNav", () => {
  it("renders router links for each nav entry", () => {
    renderWithProviders(<FooterNav links={links} />);
    expect(screen.getByRole("link", { name: "Security" })).toHaveAttribute("href", "/security");
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");
  });
});

describe("FooterLegal", () => {
  it("renders the open-source link only", () => {
    renderWithProviders(
      <FooterLegal
        openSourceLabel="Open Source"
        openSourceHref="https://github.com/dhdtech/oos"
      />,
    );
    expect(screen.getByRole("link", { name: /Open Source/ })).toHaveAttribute(
      "href",
      "https://github.com/dhdtech/oos",
    );
    expect(screen.queryByRole("link", { name: "DHDTech.io" })).not.toBeInTheDocument();
  });
});
