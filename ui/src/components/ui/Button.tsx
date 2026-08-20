import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "success";
export type ButtonSize = "default" | "sm";

interface ButtonCommon {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  loading?: boolean;
  /** Optional icon shown before the label. */
  icon?: React.ReactNode;
  className?: string;
}

type ButtonNativeProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

interface ButtonAsButton extends ButtonCommon, ButtonNativeProps {
  to?: undefined;
  href?: undefined;
}

type AnchorNativeProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">;

interface ButtonAsExternalAnchor extends ButtonCommon, AnchorNativeProps {
  href: string;
  to?: undefined;
}

type RouterNativeProps = Omit<React.ComponentProps<typeof Link>, "children">;

interface ButtonAsRouterAnchor extends ButtonCommon, RouterNativeProps {
  to: string;
  href?: undefined;
}

export type ButtonProps = ButtonAsButton | ButtonAsExternalAnchor | ButtonAsRouterAnchor;

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "default",
  full?: boolean,
  className?: string,
): string {
  return cn(
    "ui-btn",
    `ui-btn--${variant}`,
    size === "sm" ? "ui-btn--sm" : "ui-btn--default",
    full ? "ui-btn--full" : null,
    className,
  );
}

export default function Button({
  children,
  variant = "primary",
  size = "default",
  full,
  loading,
  icon,
  className,
  ...rest
}: ButtonProps) {
  const classes = buttonClassName(variant, size, full, className);

  const content = (
    <>
      {loading ? (
        <Loader2 size={16} className="ui-btn-spinner" aria-hidden="true" />
      ) : icon ? (
        <span aria-hidden="true">{icon}</span>
      ) : null}
      <span>{children}</span>
    </>
  );

  const hasTo = typeof rest.to === "string";
  const hasHref = typeof rest.href === "string";

  if (hasTo) {
    const { to, ...anchorProps } = rest;
    void to;
    return (
      <Link to={to as string} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  if (hasHref) {
    const { href, ...anchorProps } = rest;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const buttonProps = rest as ButtonNativeProps;
  return (
    <button
      type={buttonProps.type ?? "button"}
      className={classes}
      disabled={buttonProps.disabled || loading}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
