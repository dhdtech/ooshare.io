import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import CompareTable from "./CompareTable";

describe("CompareTable", () => {
  const headers = ["Feature", "OOShare", "Other"];
  const rows = [
    { label: "Encryption", values: [{ value: "Yes", tone: "yes" as const }, "No"] },
    { label: "Free", values: [{ value: "Limited", tone: "partial" as const }, "Yes"] },
  ];

  it("renders headers and row labels", () => {
    renderWithProviders(<CompareTable headers={headers} rows={rows} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByText("Encryption")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("renders cell values with tones via data-tone", () => {
    renderWithProviders(<CompareTable headers={headers} rows={rows} />);
    const tones = Array.from(document.querySelectorAll<HTMLElement>("td[data-tone]"));
    expect(tones.map(td => td.getAttribute("data-tone"))).toEqual(["yes", "partial"]);
    // the "No" plain string cell carries no data-tone
    expect([...document.querySelectorAll<HTMLElement>("td")].some(td => td.textContent === "No" && !td.hasAttribute("data-tone"))).toBe(true);
  });

  it("highlights the highlightCol column", () => {
    renderWithProviders(<CompareTable headers={headers} rows={rows} highlightCol={1} />);
    const hlCells = document.querySelectorAll(".ui-compare--hl");
    expect(hlCells.length).toBeGreaterThan(0);
    // the header at index 1 plus one body cell per row
    expect(hlCells.length).toBe(1 + rows.length);
    expect(hlCells[0]).toHaveTextContent("OOShare");
  });
});
