import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { LANGUAGES } from "../i18n";

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(code: string) {
    i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div className="lang-selector" ref={ref}>
      <button
        className="lang-trigger ui-lang-trigger"
        onClick={() => setOpen(!open)}
        aria-label="Select language"
        aria-expanded={open}
      >
        <Globe size={14} aria-hidden="true" />
        <span className="ui-lang-code">{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <div className="lang-dropdown" role="listbox" aria-label="Languages">
          {LANGUAGES.map((lang) => {
            const active = lang.code === i18n.language;
            return (
              <button
                key={lang.code}
                className={`lang-option ${active ? "lang-option--active" : ""}`}
                role="option"
                aria-selected={active}
                onClick={() => select(lang.code)}
              >
                <span className="lang-flag">{lang.flag}</span>
                <span>{lang.label}</span>
                {active ? (
                  <span className="ui-lang-check" aria-hidden="true">
                    <Check size={13} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
