import { createRoot } from "react-dom/client";
import { ToastProvider } from "@ui/components/ui/Toast";
import RevealView from "./RevealView";
import "../../src/styles/extension.css";

const root = document.getElementById("root")!;
createRoot(root).render(
  <ToastProvider>
    <RevealView />
  </ToastProvider>,
);
