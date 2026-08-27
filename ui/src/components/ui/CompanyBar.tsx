import { useTranslation } from "react-i18next";

/**
 * One-row company bar pinned to the bottom of the viewport. Carries the
 * copyright (ooshare.io), the DHDTech.io location, and the "Powered by
 * DHDTech.io" credit, styled in the ooshare design system. The rich,
 * scrollable footer keeps the nav/contact/legal links; the company line
 * lives here so it is always visible. Never write the company name as bare
 * "DHDTech" — the official name is "DHDTech.io".
 */
export function CompanyBar() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <div className="ui-company-bar">
      <div className="ui-company-bar-inner">
        <p className="ui-company-copyright">
          {t("company.copyright", { year })}
        </p>
        <p className="ui-company-location">
          <a
            href="https://dhdtech.io"
            target="_blank"
            rel="noopener noreferrer"
            className="ui-company-location-link"
          >
            {t("company.name")}
          </a>
          {t("company.location")}
        </p>
        <p className="ui-company-powered">
          <span className="ui-company-powered-label">
            {t("company.poweredBy")}
          </span>
          <a
            href="https://dhdtech.io"
            target="_blank"
            rel="noopener noreferrer"
            className="ui-company-powered-link"
          >
            <img
              src="/dhdtech-logo.png"
              alt="DHDTech.io"
              width={16}
              height={16}
              loading="lazy"
              className="ui-company-powered-logo"
            />
            DHDTech.io
          </a>
        </p>
      </div>
    </div>
  );
}
