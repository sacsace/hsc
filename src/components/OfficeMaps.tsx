function mapEmbedSrc(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
}

export function OfficeMaps({
  bangaloreLabel,
  bangaloreAddress,
  bangaloreMapEmbed,
  chennaiLabel,
  chennaiAddress,
  chennaiMapEmbed,
  openInMapsLabel,
}: {
  bangaloreLabel: string;
  bangaloreAddress: string;
  bangaloreMapEmbed?: string;
  chennaiLabel: string;
  chennaiAddress: string;
  chennaiMapEmbed?: string;
  openInMapsLabel: string;
}) {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2">
      <MapCard
        label={bangaloreLabel}
        address={bangaloreAddress}
        embedSrc={bangaloreMapEmbed}
        openLabel={openInMapsLabel}
      />
      <MapCard
        label={chennaiLabel}
        address={chennaiAddress}
        embedSrc={chennaiMapEmbed}
        openLabel={openInMapsLabel}
      />
    </div>
  );
}

function MapCard({
  label,
  address,
  embedSrc,
  openLabel,
}: {
  label: string;
  address: string;
  embedSrc?: string;
  openLabel: string;
}) {
  if (!address?.trim() && !embedSrc?.trim()) return null;

  const src = embedSrc?.trim() || mapEmbedSrc(address);
  const openSrc = embedSrc?.trim()
    ? embedSrc.replace("/maps/embed?", "/maps?").replace("&output=embed", "")
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const mapsOpen = address?.trim()
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : openSrc;

  return (
    <div className="overflow-hidden rounded-[1rem] border border-[var(--line)] bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-[var(--steel)]">{label}</p>
          {address ? (
            <p className="mt-1 line-clamp-2 text-sm text-[var(--ink)]">{address}</p>
          ) : null}
        </div>
        <a
          href={mapsOpen}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-semibold text-[var(--navy)] underline underline-offset-4 hover:opacity-80"
        >
          {openLabel}
        </a>
      </div>
      <div className="relative aspect-[16/11] w-full bg-[var(--bg)]">
        <iframe
          title={label}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
