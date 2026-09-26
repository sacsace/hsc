"use client";

import { useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import {
  dateSortKey,
  type Locale,
  type PerformanceItem,
  type SiteContent,
} from "@/lib/types";

type SortKey = "date" | "detail" | "client";
type SortDir = "asc" | "desc";

function compareText(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base", numeric: true });
}

function sortRows(items: PerformanceItem[], key: SortKey, dir: SortDir) {
  const factor = dir === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    if (key === "date") {
      return (dateSortKey(a.date) - dateSortKey(b.date)) * factor;
    }
    if (key === "detail") {
      return compareText(a.detail || "", b.detail || "") * factor;
    }
    return compareText(a.client || "", b.client || "") * factor;
  });
}

function SortMark({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) {
    return <span className="ml-1 inline-block text-white/35">↕</span>;
  }
  return <span className="ml-1 inline-block">{dir === "asc" ? "↑" : "↓"}</span>;
}

function PerformanceSections() {
  const { content, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc"); // 최근일 위

  const allRows = useMemo(
    () =>
      (content.performances || []).filter(
        (row) => row.date?.trim() || row.detail?.trim() || row.client?.trim(),
      ),
    [content.performances],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = !q
      ? allRows
      : allRows.filter((row) => {
          const haystack = `${row.date} ${row.detail} ${row.client}`.toLowerCase();
          return haystack.includes(q);
        });
    return sortRows(filtered, sortKey, sortDir);
  }, [allRows, query, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    // 일자는 기본 최신순(내림차순), 나머지 컬럼은 오름차순
    setSortDir(key === "date" ? "desc" : "asc");
  }

  const headers: { key: SortKey; label: string }[] = [
    { key: "date", label: t.table.date },
    { key: "detail", label: t.table.details },
    { key: "client", label: t.table.client },
  ];

  return (
    <div className="site-shell bg-white">
      <Header variant="solid" />

      <main className="flex-1">
        <section className="border-b border-[var(--line)] bg-[var(--navy-deep)] pt-28 pb-14 text-white md:pt-32 md:pb-16">
          <div className="container">
            <p className="section-label !text-white/55">{t.performanceLabel}</p>
            <h1 className="section-title !mb-3 !text-white">{t.performanceTitle}</h1>
            <p className="max-w-xl text-white/70">{t.performanceLead}</p>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--muted)]">
                {query.trim()
                  ? t.performanceResultCount(rows.length, allRows.length)
                  : t.performanceTotalCount(allRows.length)}
              </p>
              <label className="block w-full max-w-md text-sm sm:ml-auto">
                <span className="sr-only">{t.performanceSearch}</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.performanceSearchPlaceholder}
                  className="w-full border border-[var(--line)] bg-[#f8fafb] px-3 py-2.5 text-sm outline-none focus:border-[var(--navy)] focus:bg-white"
                />
              </label>
            </div>

            {allRows.length === 0 ? (
              <p className="text-[var(--muted)]">{t.performanceEmpty}</p>
            ) : rows.length === 0 ? (
              <p className="text-[var(--muted)]">{t.performanceNoResults}</p>
            ) : (
              <div className="overflow-hidden border border-[var(--line)] bg-white">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[var(--navy)] text-white">
                    <tr>
                      {headers.map((header) => (
                        <th key={header.key} className="px-4 py-3 font-medium md:px-5">
                          <button
                            type="button"
                            onClick={() => toggleSort(header.key)}
                            className="inline-flex items-center text-left hover:text-white/85"
                          >
                            {header.label}
                            <SortMark active={sortKey === header.key} dir={sortDir} />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={row.id || `${row.date}-${row.client}-${i}`}
                        className="border-t border-[var(--line)] align-top"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)] md:px-5">
                          {row.date || "—"}
                        </td>
                        <td className="px-4 py-3 text-[var(--ink)] md:px-5">
                          {row.detail || "—"}
                        </td>
                        <td className="px-4 py-3 font-medium text-[var(--ink)] md:px-5">
                          {row.client || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function PerformancePage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale?: Locale;
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <PerformanceSections />
    </LanguageProvider>
  );
}
