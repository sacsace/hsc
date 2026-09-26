"use client";

import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import type { SiteContent, TeamMember } from "@/lib/types";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function MemberPhoto({ member, className }: { member: TeamMember; className?: string }) {
  if (member.photo) {
    return (
      <div className={`relative overflow-hidden rounded-md bg-[var(--bg)] ${className ?? ""}`}>
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 40vw, 180px"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-md bg-[var(--navy-deep)] font-display text-xl font-semibold tracking-wide text-white/90 ${className ?? ""}`}
      aria-hidden
    >
      {initials(member.name)}
    </div>
  );
}

function TeamSections() {
  const { content, t } = useLanguage();
  const team = content.team;
  const ceo = team?.ceo;
  const members = (team?.members || []).filter((m) => m.name?.trim());
  const hasCeo = Boolean(ceo?.name?.trim());
  const hasAnyone = hasCeo || members.length > 0;

  return (
    <div className="site-shell bg-white">
      <Header variant="solid" />

      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[var(--navy-deep)] pt-28 pb-14 text-white md:pt-32 md:pb-16">
          <div className="container">
            <p className="section-label !text-white/55">{t.teamLabel}</p>
            <h1 className="section-title !mb-3 !text-white">{team?.title || t.teamTitle}</h1>
            <p className="max-w-xl text-white/70">{team?.lead || t.teamLead}</p>
          </div>
        </section>

        <section className="section bg-white text-[var(--ink)]">
          <div className="container space-y-14">
            {!hasAnyone ? (
              <p className="text-[var(--muted)]">{t.teamEmpty}</p>
            ) : null}

            {hasCeo && ceo ? (
              <article className="grid gap-6 border-b border-[var(--line)] pb-14 md:grid-cols-[168px_1fr] md:items-start lg:grid-cols-[168px_1fr]">
                <MemberPhoto
                  member={ceo}
                  className="aspect-[4/5] w-full max-w-[168px]"
                />
                <div>
                  <p className="text-xs font-medium tracking-[0.12em] text-[var(--steel)]">
                    {t.teamCeoLabel}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-medium tracking-tight md:text-2xl">
                    {ceo.name}
                  </h2>
                  {ceo.role ? (
                    <p className="mt-2 text-sm font-normal text-[var(--navy)]">{ceo.role}</p>
                  ) : null}
                  {ceo.bio ? (
                    <p className="mt-4 max-w-2xl text-[0.95rem] font-normal leading-relaxed text-[var(--muted)] whitespace-pre-line text-justify">
                      {ceo.bio}
                    </p>
                  ) : null}
                </div>
              </article>
            ) : null}

            {members.length > 0 ? (
              <div>
                {hasCeo ? (
                  <h2 className="font-display text-lg font-medium tracking-tight md:text-xl">
                    {t.teamMembersLabel}
                  </h2>
                ) : null}
                <div
                  className={`grid gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${hasCeo ? "mt-6" : ""}`}
                >
                  {members.map((member, index) => (
                    <article key={`${member.name}-${index}`} className="max-w-[168px] space-y-3">
                      <MemberPhoto member={member} className="aspect-[4/5] w-full" />
                      <div>
                        <h3 className="font-display text-base font-medium tracking-tight">
                          {member.name}
                        </h3>
                        {member.role ? (
                          <p className="mt-1 text-sm font-normal text-[var(--navy)]">{member.role}</p>
                        ) : null}
                        {member.bio ? (
                          <p className="mt-1.5 text-xs font-normal leading-relaxed text-[var(--muted)] whitespace-pre-line">
                            {member.bio}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function TeamPage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale?: "ko" | "en";
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <TeamSections />
    </LanguageProvider>
  );
}
