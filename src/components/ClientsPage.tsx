"use client";

import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import type { ClientItem, Locale, SiteContent } from "@/lib/types";

function ClientCard({ client }: { client: ClientItem }) {
  return (
    <div className="flex min-h-[112px] flex-col items-center justify-center gap-2.5 rounded-md border border-[var(--line)] bg-white px-4 py-4 text-center">
      <div className="relative flex h-12 w-full items-center justify-center">
        {client.logo ? (
          <Image
            src={client.logo}
            alt={client.name}
            fill
            className="object-contain"
            sizes="220px"
          />
        ) : (
          <div className="h-full w-full rounded-md bg-[#f5f7f9]" aria-hidden />
        )}
      </div>
      <p className="text-sm font-medium tracking-wide text-[var(--ink)]">
        {client.name || "—"}
      </p>
    </div>
  );
}

function ClientsSections() {
  const { content, t } = useLanguage();
  const clients = content.clients;
  const items = clients?.items || [];

  return (
    <div className="site-shell bg-white">
      <Header variant="solid" />

      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[var(--navy-deep)] pt-28 pb-14 text-white md:pt-32 md:pb-16">
          <div className="container">
            <p className="section-label !text-white/55">{t.clientsLabel}</p>
            <h1 className="section-title !mb-3 !text-white">
              {clients?.title || t.clientsTitle}
            </h1>
            <p className="max-w-3xl text-pretty text-white/70 leading-relaxed">
              {clients?.lead || t.clientsLead}
            </p>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            {items.length ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
              </div>
            ) : (
              <p className="text-[var(--muted)]">{t.clientsEmpty}</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function ClientsPage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale?: Locale;
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <ClientsSections />
    </LanguageProvider>
  );
}
