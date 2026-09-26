"use client";

type ViewMode = "card" | "list";

function ListIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ViewModeToggle({
  value,
  onChange,
  listLabel,
  cardLabel,
}: {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  listLabel: string;
  cardLabel: string;
}) {
  const base =
    "inline-flex h-10 w-10 items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--navy)]";
  const active = "bg-[var(--navy)] text-white";
  const idle = "bg-white text-[var(--ink)] hover:bg-[#f8fafb]";

  return (
    <div className="inline-flex overflow-hidden border border-[var(--line)]" role="group">
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label={listLabel}
        title={listLabel}
        aria-pressed={value === "list"}
        className={`${base} ${value === "list" ? active : idle}`}
      >
        <ListIcon />
      </button>
      <button
        type="button"
        onClick={() => onChange("card")}
        aria-label={cardLabel}
        title={cardLabel}
        aria-pressed={value === "card"}
        className={`${base} border-l border-[var(--line)] ${value === "card" ? active : idle}`}
      >
        <CardIcon />
      </button>
    </div>
  );
}
