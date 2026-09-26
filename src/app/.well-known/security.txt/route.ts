import { getSiteUrl } from "@/lib/seo";

export function GET() {
  const siteUrl = getSiteUrl();
  const expires = "2027-12-31T23:59:59.000Z";
  const body = [
    `Contact: mailto:hyun.hs@hksc.in`,
    `Contact: ${siteUrl}/contact`,
    `Preferred-Languages: en, ko`,
    `Canonical: ${siteUrl}/.well-known/security.txt`,
    `Expires: ${expires}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
