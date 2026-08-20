import { describe, expect, it } from "vitest";
import en from "@ui/i18n/locales/en.json";
import zh from "@ui/i18n/locales/zh.json";
import es from "@ui/i18n/locales/es.json";
import hi from "@ui/i18n/locales/hi.json";
import ar from "@ui/i18n/locales/ar.json";
import pt from "@ui/i18n/locales/pt.json";

const EXTENSION_KEYS = [
  "extension.contextReveal",
  "extension.contextCreate",
  "extension.tabCreate",
  "extension.tabReveal",
  "extension.createLabel",
  "extension.createPlaceholder",
  "extension.createExpires",
  "extension.createSubmit",
  "extension.createEncrypting",
  "extension.createCreated",
  "extension.createAnother",
  "extension.revealPlaceholder",
  "extension.revealButton",
  "extension.revealLoading",
  "extension.revealDestroyed",
  "extension.copy",
  "extension.copied",
  "extension.toastCopied",
  "extension.download",
  "extension.openInSite",
  "extension.notFoundTitle",
  "extension.notFoundMsg",
  "extension.errorTitle",
  "extension.optionsTitle",
  "extension.optionsTtl",
  "extension.optionsLang",
  "extension.optionsAnnotator",
  "extension.optionsAnnotatorDesc",
  "extension.optionsSaved",
];

const LOCALES = { en, zh, es, hi, ar, pt } as const;

describe("i18n parity", () => {
  it("exposes every extension key in every language", () => {
    for (const [code, file] of Object.entries(LOCALES)) {
      for (const key of EXTENSION_KEYS) {
        const value = key.split(".").reduce((o, k) => o?.[k], file as any);
        expect(value, `${code}: missing ${key}`).toBeTruthy();
      }
    }
  });
});
