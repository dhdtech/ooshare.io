import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CreateTab from "./CreateTab";
import { ToastProvider } from "@ui/components/ui/Toast";

vi.mock("../../src/lib/secret-service", () => ({
  createShare: vi.fn().mockResolvedValue({ url: "https://ooshare.io/s/X#K", id: "u", alias: "X" }),
  newSecretId: () => "uuid",
}));

describe("CreateTab", () => {
  it("requires text or a file before enabling submit", () => {
    render(<CreateTab />);
    expect(screen.getByRole("button", { name: /create/i })).toBeDisabled();
    expect(screen.getByPlaceholderText(/secret/i)).toBeInTheDocument();
  });

  it("submits text and shows the share URL", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <CreateTab />
      </ToastProvider>,
    );
    await user.type(screen.getByPlaceholderText(/secret/i), "hi");
    await user.click(screen.getByRole("button", { name: /create/i }));
    expect(await screen.findByText("https://ooshare.io/s/X#K")).toBeInTheDocument();
  });
});
