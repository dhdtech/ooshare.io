import { createRoot } from "react-dom/client";
import App from "./App";
import "../../src/styles/extension.css";

const root = document.getElementById("root")!;
createRoot(root).render(<App />);
