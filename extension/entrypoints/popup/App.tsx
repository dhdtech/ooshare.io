import { useState } from "react";
import SegmentedControl from "@ui/components/ui/SegmentedControl";
import CreateTab from "./CreateTab";
import RevealTab from "./RevealTab";

export default function App() {
  const [tab, setTab] = useState<"create" | "reveal">("create");
  return (
    <div className="create-wrap">
      <SegmentedControl
        options={[
          { value: "create", label: "Create" },
          { value: "reveal", label: "Reveal" },
        ]}
        value={tab}
        onChange={(v) => setTab(v as "create" | "reveal")}
        aria-label="ooshare mode"
      />
      <div style={{ marginTop: 12 }}>{tab === "create" ? <CreateTab /> : <RevealTab />}</div>
    </div>
  );
}
