import { useState } from "react";
import { useTranslation } from "react-i18next";
import SegmentedControl from "@ui/components/ui/SegmentedControl";
import CreateTab from "./CreateTab";
import RevealTab from "./RevealTab";

export default function App() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"create" | "reveal">("create");
  return (
    <div className="create-wrap">
      <SegmentedControl
        options={[
          { value: "create", label: t("extension.tabCreate") },
          { value: "reveal", label: t("extension.tabReveal") },
        ]}
        value={tab}
        onChange={(v) => setTab(v as "create" | "reveal")}
        aria-label="ooshare mode"
      />
      <div style={{ marginTop: 12 }}>{tab === "create" ? <CreateTab /> : <RevealTab />}</div>
    </div>
  );
}
