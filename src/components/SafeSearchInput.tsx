"use client";

import { useEffect, useState, type ChangeEventHandler } from "react";

/**
 * Password-manager extensions inject attributes/nodes into inputs before
 * React hydrates. Defer the real input until after mount to avoid mismatches.
 */
export function SafeSearchInput({
  value,
  onChange,
  placeholder,
  className,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={className}
        aria-hidden
        style={{ minHeight: "2.75rem" }}
      />
    );
  }

  return (
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      aria-label={ariaLabel}
      autoComplete="off"
    />
  );
}
