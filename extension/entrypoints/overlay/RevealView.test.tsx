import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RevealView from "./RevealView";
import { ToastProvider } from "@ui/components/ui/Toast";

describe("RevealView", () => {
  it("renders revealed text with a copy button", async () => {
    render(
      <ToastProvider>
        <RevealView />
      </ToastProvider>,
    );
    const data: unknown = {
      type: "ooshare:reveal",
      payload: { text: "s3cr3t-value" },
    };
    window.postMessage(data as MessageEvent["data"], location.origin);
    expect(await screen.findByText("s3cr3t-value")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("renders an image attachment", async () => {
    const { container } = render(
      <ToastProvider>
        <RevealView />
      </ToastProvider>,
    );
    const bytes = new TextEncoder().encode("fake-png").buffer;
    window.postMessage(
      {
        type: "ooshare:reveal",
        payload: { text: "", attachment: { mime: "image/png", data: bytes } },
      },
      location.origin,
    );
    await screen.findByText("Only Once Share");
    await waitFor(() => {
      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      expect(img!.src.startsWith("blob:")).toBe(true);
    });
  });
});
