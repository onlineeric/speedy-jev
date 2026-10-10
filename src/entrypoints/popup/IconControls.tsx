import type { ReactNode } from 'react';

interface IconControlProps {
  /** Shown as the tooltip and used as the accessible name, since the control has no visible text. */
  label: string;
  icon: ReactNode;
}

interface IconButtonProps extends IconControlProps {
  onClick: () => void;
  disabled?: boolean;
}

export function IconButton({ label, icon, onClick, disabled }: IconButtonProps) {
  return (
    <button
      type="button"
      className="icon-control"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );
}

interface IconLinkProps extends IconControlProps {
  href: string;
}

/** Opens `href` in a new tab of the user's browser. */
export function IconLink({ label, icon, href }: IconLinkProps) {
  return (
    <a
      className="icon-control"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
    >
      {icon}
    </a>
  );
}
