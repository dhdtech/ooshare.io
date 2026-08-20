import { createRoot } from "react-dom/client";
import Overlay from "./Overlay";
import "../../src/styles/extension.css";

const root = document.getElementById("root")!;
createRoot(root).render(<Overlay />);
