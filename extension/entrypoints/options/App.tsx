import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Globe, Tags } from "lucide-react";
import { browser } from "wxt/browser";
import Card from "@ui/components/ui/Card";
import Button from "@ui/components/ui/Button";
import SegmentedControl from "@ui/components/ui/SegmentedControl";
import { useToast } from "@ui/components/ui/Toast";
import { TTL_OPTIONS } from "../../src/lib/ttl";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "hi", label: "हिन्दी" },
  { code: "ar", label: "العربية" },
  { code: "pt", label: "Português" },
];

interface Settings {
  ttlHours: number;
  language: string;
  annotator: boolean;
}

const DEFAULTS: Settings = { ttlHours: 24, language: "en", annotator: false };

export default function App() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    browser.storage.sync
      .get(DEFAULTS as Record<string, unknown>)
      .then((stored) => {
        if (!mounted) return;
        const val = stored as unknown as Record<string, unknown>;
        setSettings({
          ttlHours: typeof val.ttlHours === "number" ? val.ttlHours : DEFAULTS.ttlHours,
          language: typeof val.language === "string" ? val.language : DEFAULTS.language,
          annotator: val.annotator === true,
        });
        setReady(true);
      })
      .catch(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await browser.storage.sync.set(settings as Record<string, unknown>);
      showToast(t("extension.optionsSaved"), "success");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="create-wrap">
      <h2 className="result-header" style={{ margin: "0 0 16px" }}>
        {t("extension.optionsTitle")}
      </h2>

      <div className="ttl-group" style={{ marginBottom: 16 }}>
        <span className="form-label">
          <Clock size={14} /> {t("extension.optionsTtl")}
        </span>
        <SegmentedControl
          options={TTL_OPTIONS}
          value={settings.ttlHours}
          onChange={(v) => setSettings((s) => ({ ...s, ttlHours: v }))}
          aria-label={t("extension.optionsTtl")}
        />
      </div>

      <label className="form-label" htmlFor="ooshare-lang" style={{ display: "block", marginBottom: 16 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Globe size={14} /> {t("extension.optionsLang")}
        </span>
        <select
          id="ooshare-lang"
          className="ui-field-control"
          value={settings.language}
          onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
          style={{ display: "block", marginTop: 8, width: "100%" }}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </label>

      <label className="option-check" style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20 }}>
        <input
          type="checkbox"
          checked={settings.annotator}
          onChange={(e) => setSettings((s) => ({ ...s, annotator: e.target.checked }))}
          style={{ marginTop: 2 }}
        />
        <span>
          <span className="form-label" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Tags size={14} /> {t("extension.optionsAnnotator")}
          </span>
          <span className="result-info" style={{ display: "block", marginTop: 4 }}>
            {t("extension.optionsAnnotatorDesc")}
          </span>
        </span>
      </label>

      <Button variant="primary" full loading={saving} onClick={handleSave}>
        {t("extension.optionsSaved")}
      </Button>
      {!ready && <span className="result-info" style={{ display: "block", textAlign: "center", marginTop: 12 }}>…</span>}
    </Card>
  );
}
