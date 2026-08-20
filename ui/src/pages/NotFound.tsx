import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  ErrorState,
  BackLink,
} from "../components/ui";

export default function NotFound() {
  const { t } = useTranslation();

  useEffect(() => {
    document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex");
    return () => {
      document.querySelector('meta[name="robots"]')?.setAttribute("content", "index, follow");
    };
  }, []);

  return (
    <div className="content-page">
      <Card>
        <ErrorState
          title={t("notFound.title")}
          message={t("notFound.message")}
          actions={<BackLink to="/">{t("nav.backHome")}</BackLink>}
        />
      </Card>
    </div>
  );
}
