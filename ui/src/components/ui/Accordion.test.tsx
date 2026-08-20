import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/render";
import Accordion from "./Accordion";

describe("Accordion", () => {
  it("renders question as a summary and hides the answer by default", () => {
    renderWithProviders(
      <Accordion question="What happens after one view?">
        <p>It is destroyed.</p>
      </Accordion>,
    );
    expect(screen.getByText("What happens after one view?")).toBeInTheDocument();
    expect(screen.getByText("It is destroyed.")).toBeInTheDocument();
  });

  it("is closed by default and opens/toggles on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Accordion question="Q">
        <p>Answer</p>
      </Accordion>,
    );
    const details = document.querySelector("details")!;
    expect(details).not.toHaveAttribute("open");
    await user.click(screen.getByText("Q"));
    expect(details).toHaveAttribute("open");
    await user.click(screen.getByText("Q"));
    expect(details).not.toHaveAttribute("open");
  });

  it("respects defaultOpen", () => {
    renderWithProviders(
      <Accordion question="Q" defaultOpen>
        <p>Answer</p>
      </Accordion>,
    );
    expect(document.querySelector("details")).toHaveAttribute("open");
  });
});
