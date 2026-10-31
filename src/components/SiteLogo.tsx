export function SiteLogo({
  tone = "color",
  className = "",
  priority = false,
}: {
  tone?: "color" | "light";
  className?: string;
  priority?: boolean;
}) {
  const textTone = tone === "light" ? "!text-white" : "text-[var(--ink)]";

  return (
    <span className="inline-flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/symbol-hsc.png"
        alt=""
        width={1272}
        height={1153}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
        className={`h-7 w-auto shrink-0 bg-transparent object-contain md:h-8 ${className}`}
        aria-hidden
      />
      <span className={`font-display leading-[1.05] ${textTone}`}>
        <span className="block text-[0.72rem] font-semibold tracking-[0.04em] sm:text-[0.8rem] md:text-[0.88rem]">
          HANKOOK
        </span>
        <span className="mt-0.5 block text-[0.52rem] font-medium tracking-[0.14em] opacity-80 sm:text-[0.58rem] md:text-[0.62rem]">
          SERVICE CENTER
        </span>
      </span>
      <span className="sr-only">Hankook Service Center</span>
    </span>
  );
}
