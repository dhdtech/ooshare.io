import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HelpCircle,
  Shield,
  Lock,
  Eye,
  Trash2,
  Server,
  Hash,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { IconButton, Modal } from "./ui";

const SECURITY_ITEMS = [
  { icon: Lock, key: "e2e" },
  { icon: KeyRound, key: "hkdf" },
  { icon: ShieldCheck, key: "aad" },
  { icon: Eye, key: "zk" },
  { icon: Hash, key: "key" },
  { icon: Trash2, key: "oneTime" },
  { icon: Server, key: "expiry" },
] as const;

export default function SecurityModal() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const title = t("security.title");

  return (
    <>
      <IconButton
        icon={<HelpCircle size={18} />}
        aria-label={title}
        onClick={() => setOpen(true)}
      />

      <Modal open={open} onClose={() => setOpen(false)} title={title} icon={<Shield size={18} />}>
        <div>
          {SECURITY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div className="security-item" key={item.key}>
                <div className="security-item-icon">
                  <Icon size={16} />
                </div>
                <div>
                  <h3>{t(`security.${item.key}Title`)}</h3>
                  <p>{t(`security.${item.key}Desc`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
