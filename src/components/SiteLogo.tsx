import Image from "next/image";

export function SiteLogo({
  tone = "color",
  className = "",
  priority = false,
}: {
  tone?: "color" | "light";
  className?: string;
  priority?: boolean;
}) {
  const src = tone === "light" ? "/images/logo-hsc-light.png" : "/images/logo-hsc.png";

  return (
    <Image
      src={src}
      alt="Hankook Service Center"
      width={1718}
      height={343}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      sizes="(max-width: 768px) 200px, 260px"
      className={`h-8 w-auto max-w-[min(56vw,240px)] object-contain object-left md:h-9 md:max-w-[260px] ${className}`}
    />
  );
}
