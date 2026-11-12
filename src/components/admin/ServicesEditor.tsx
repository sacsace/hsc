"use client";

import { useRef, useState } from "react";
import type { AdminUi } from "@/lib/admin-ui";
import type {
  ServiceBrandItem,
  ServiceCategoryItem,
  ServiceOfferingItem,
  ServiceProductItem,
  ServicesContent,
} from "@/lib/types";

type Tab = "page" | "offerings" | "brands" | "categories";

function emptyOffering(): ServiceOfferingItem {
  return { id: `off-${Date.now()}`, title: "", description: "" };
}

function emptyBrand(): ServiceBrandItem {
  return {
    id: `brand-${Date.now()}`,
    slug: "",
    brand: "",
    folder: "",
    lead: "",
    products: [],
  };
}

function emptyProduct(): ServiceProductItem {
  return {
    id: `prod-${Date.now()}`,
    title: "",
    image: "",
    description: "",
    file: "",
    fileName: "",
  };
}

function emptyCategory(): ServiceCategoryItem {
  return {
    id: `cat-${Date.now()}`,
    title: "",
    description: "",
    items: [],
    file: "",
    fileName: "",
  };
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = index + direction;
  if (next < 0 || next >= items.length) return items;
  const copy = [...items];
  const tmp = copy[index];
  copy[index] = copy[next];
  copy[next] = tmp;
  return copy;
}

function MoveButtons({
  index,
  total,
  onMove,
  labelUp,
  labelDown,
}: {
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  labelUp: string;
  labelDown: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMove(-1);
        }}
        disabled={index === 0}
        className="border border-[var(--line)] bg-white px-1.5 py-1 text-xs disabled:opacity-30"
        aria-label={labelUp}
        title={labelUp}
      >
        ↑
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMove(1);
        }}
        disabled={index >= total - 1}
        className="border border-[var(--line)] bg-white px-1.5 py-1 text-xs disabled:opacity-30"
        aria-label={labelDown}
        title={labelDown}
      >
        ↓
      </button>
    </div>
  );
}

export function ServicesEditor({
  ui,
  services,
  onChange,
}: {
  ui: AdminUi;
  services: ServicesContent;
  onChange: (services: ServicesContent) => void;
}) {
  const [tab, setTab] = useState<Tab>("page");

  const tabs: { id: Tab; label: string }[] = [
    { id: "page", label: ui.servicesPage },
    { id: "offerings", label: ui.servicesOfferings },
    { id: "brands", label: ui.servicesBrands },
    { id: "categories", label: ui.servicesCategories },
  ];

  return (
    <section className="w-full min-w-0 border border-[var(--line)] bg-white p-4 sm:p-5 md:p-6">
      <div className="mb-5">
        <h2 className="font-display text-base font-bold sm:text-lg">{ui.services}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{ui.servicesHint}</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-1 border-b border-[var(--line)] pb-3">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === item.id
                ? "bg-[var(--navy)] text-white"
                : "border border-[var(--line)] bg-[#f8fafb] text-[var(--ink)] hover:bg-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "page" ? (
        <div className="grid gap-4">
          <Field
            label={ui.title}
            value={services.title}
            onChange={(v) => onChange({ ...services, title: v })}
          />
          <Field
            label="Label"
            value={services.label}
            onChange={(v) => onChange({ ...services, label: v })}
          />
          <TextArea
            label={ui.intro}
            value={services.lead}
            onChange={(v) => onChange({ ...services, lead: v })}
            rows={3}
          />
          <Field
            label={`${ui.servicesOfferings} title`}
            value={services.offeringsTitle}
            onChange={(v) => onChange({ ...services, offeringsTitle: v })}
          />
          <TextArea
            label={`${ui.servicesOfferings} lead`}
            value={services.offeringsLead}
            onChange={(v) => onChange({ ...services, offeringsLead: v })}
            rows={2}
          />
          <Field
            label={`${ui.servicesCategories} title`}
            value={services.equipmentTitle}
            onChange={(v) => onChange({ ...services, equipmentTitle: v })}
          />
          <TextArea
            label={`${ui.servicesCategories} lead`}
            value={services.equipmentLead}
            onChange={(v) => onChange({ ...services, equipmentLead: v })}
            rows={2}
          />
          <Field
            label="CTA title"
            value={services.ctaTitle}
            onChange={(v) => onChange({ ...services, ctaTitle: v })}
          />
          <TextArea
            label="CTA lead"
            value={services.ctaLead}
            onChange={(v) => onChange({ ...services, ctaLead: v })}
            rows={2}
          />
          <Field
            label="CTA button"
            value={services.ctaButton}
            onChange={(v) => onChange({ ...services, ctaButton: v })}
          />
          <Field
            label="View docs label"
            value={services.viewDocs}
            onChange={(v) => onChange({ ...services, viewDocs: v })}
          />
        </div>
      ) : null}

      {tab === "offerings" ? (
        <OfferingsEditor
          ui={ui}
          items={services.offerings}
          onChange={(offerings) => onChange({ ...services, offerings })}
        />
      ) : null}

      {tab === "brands" ? (
        <BrandsEditor
          ui={ui}
          items={services.brands}
          onChange={(brands) => onChange({ ...services, brands })}
        />
      ) : null}

      {tab === "categories" ? (
        <CategoriesEditor
          ui={ui}
          items={services.categories}
          brands={services.brands}
          onChange={(categories) => onChange({ ...services, categories })}
        />
      ) : null}
    </section>
  );
}

function OfferingsEditor({
  ui,
  items,
  onChange,
}: {
  ui: AdminUi;
  items: ServiceOfferingItem[];
  onChange: (items: ServiceOfferingItem[]) => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-primary text-sm"
          onClick={() => onChange([...items, emptyOffering()])}
        >
          {ui.servicesAddOffering}
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{ui.servicesEmptyOfferings}</p>
      ) : (
        items.map((item, index) => (
          <div key={item.id} className="border border-[var(--line)] bg-[#f8fafb] p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[var(--muted)]">#{index + 1}</p>
              <div className="flex items-center gap-2">
                <MoveButtons
                  index={index}
                  total={items.length}
                  onMove={(direction) => onChange(moveItem(items, index, direction))}
                  labelUp={ui.servicesMoveUp}
                  labelDown={ui.servicesMoveDown}
                />
                <button
                  type="button"
                  className="text-xs text-red-600 hover:underline"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  {ui.delete}
                </button>
              </div>
            </div>
            <div className="grid gap-3">
              <Field
                label={ui.title}
                value={item.title}
                onChange={(v) =>
                  onChange(items.map((row, i) => (i === index ? { ...row, title: v } : row)))
                }
              />
              <TextArea
                label={ui.body}
                value={item.description}
                onChange={(v) =>
                  onChange(
                    items.map((row, i) => (i === index ? { ...row, description: v } : row)),
                  )
                }
                rows={3}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function BrandsEditor({
  ui,
  items,
  onChange,
}: {
  ui: AdminUi;
  items: ServiceBrandItem[];
  onChange: (items: ServiceBrandItem[]) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-primary text-sm"
          onClick={() => {
            const next = emptyBrand();
            onChange([...items, next]);
            setOpenId(next.id);
          }}
        >
          {ui.servicesAddBrand}
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{ui.servicesEmptyBrands}</p>
      ) : (
        items.map((brand, index) => {
          const open = openId === brand.id;
          return (
            <div key={brand.id} className="border border-[var(--line)]">
              <div className="flex w-full items-center gap-2 bg-[#f5f7f9] px-3 py-2 sm:px-4 sm:py-3">
                <MoveButtons
                  index={index}
                  total={items.length}
                  onMove={(direction) => onChange(moveItem(items, index, direction))}
                  labelUp={ui.servicesMoveUp}
                  labelDown={ui.servicesMoveDown}
                />
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                  onClick={() => setOpenId(open ? null : brand.id)}
                >
                  <span className="truncate text-sm font-semibold text-[var(--ink)]">
                    {brand.brand || brand.slug || `(brand ${index + 1})`}
                    <span className="ml-2 text-xs font-normal text-[var(--muted)]">
                      /services/{brand.slug || "…"} · {brand.products.length}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-[var(--muted)]">
                    {open ? "▲" : "▼"}
                  </span>
                </button>
              </div>
              {open ? (
                <div className="grid gap-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[var(--muted)]">
                      #{index + 1} / {items.length}
                    </p>
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => {
                        onChange(items.filter((_, i) => i !== index));
                        setOpenId(null);
                      }}
                    >
                      {ui.delete}
                    </button>
                  </div>
                  <Field
                    label={ui.servicesBrandName}
                    value={brand.brand}
                    onChange={(v) => {
                      const slug = brand.slug || slugify(v);
                      onChange(
                        items.map((row, i) =>
                          i === index ? { ...row, brand: v, slug: row.slug || slug } : row,
                        ),
                      );
                    }}
                  />
                  <Field
                    label={ui.servicesSlug}
                    value={brand.slug}
                    onChange={(v) =>
                      onChange(
                        items.map((row, i) =>
                          i === index ? { ...row, slug: slugify(v) || v } : row,
                        ),
                      )
                    }
                  />
                  <Field
                    label={ui.servicesFolder}
                    value={brand.folder}
                    onChange={(v) =>
                      onChange(items.map((row, i) => (i === index ? { ...row, folder: v } : row)))
                    }
                  />
                  <TextArea
                    label={ui.servicesLead}
                    value={brand.lead}
                    onChange={(v) =>
                      onChange(items.map((row, i) => (i === index ? { ...row, lead: v } : row)))
                    }
                    rows={2}
                  />

                  <div className="border-t border-[var(--line)] pt-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {ui.servicesBrands}
                      </p>
                      <button
                        type="button"
                        className="border border-[var(--line)] px-2 py-1 text-xs hover:bg-[#f5f7f9]"
                        onClick={() =>
                          onChange(
                            items.map((row, i) =>
                              i === index
                                ? { ...row, products: [...row.products, emptyProduct()] }
                                : row,
                            ),
                          )
                        }
                      >
                        {ui.servicesAddProduct}
                      </button>
                    </div>
                    <div className="grid gap-3">
                      {brand.products.map((product, pIndex) => (
                        <div key={product.id} className="grid gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-[var(--muted)]">
                              #{pIndex + 1}
                            </p>
                            <MoveButtons
                              index={pIndex}
                              total={brand.products.length}
                              onMove={(direction) =>
                                onChange(
                                  items.map((row, i) =>
                                    i === index
                                      ? {
                                          ...row,
                                          products: moveItem(
                                            row.products,
                                            pIndex,
                                            direction,
                                          ),
                                        }
                                      : row,
                                  ),
                                )
                              }
                              labelUp={ui.servicesMoveUp}
                              labelDown={ui.servicesMoveDown}
                            />
                          </div>
                          <ProductEditor
                            ui={ui}
                            product={product}
                            onChange={(next) =>
                              onChange(
                                items.map((row, i) =>
                                  i === index
                                    ? {
                                        ...row,
                                        products: row.products.map((p, j) =>
                                          j === pIndex ? next : p,
                                        ),
                                      }
                                    : row,
                                ),
                              )
                            }
                            onRemove={() =>
                              onChange(
                                items.map((row, i) =>
                                  i === index
                                    ? {
                                        ...row,
                                        products: row.products.filter(
                                          (_, j) => j !== pIndex,
                                        ),
                                      }
                                    : row,
                                ),
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}

function ProductEditor({
  ui,
  product,
  onChange,
  onRemove,
}: {
  ui: AdminUi;
  product: ServiceProductItem;
  onChange: (product: ServiceProductItem) => void;
  onRemove: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File) {
    setUploadError("");
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUploadError(data.error || "Upload failed");
      return;
    }
    const data = (await res.json()) as { url: string };
    onChange({ ...product, image: data.url });
  }

  async function uploadCatalog(file: File) {
    setUploadError("");
    setUploadingFile(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setUploadingFile(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUploadError(data.error || "Upload failed");
      return;
    }
    const data = (await res.json()) as { url: string; fileName?: string };
    onChange({
      ...product,
      file: data.url,
      fileName: data.fileName || file.name,
    });
  }

  return (
    <div className="border border-[var(--line)] bg-white p-3">
      <div className="mb-2 flex justify-end">
        <button type="button" className="text-xs text-red-600 hover:underline" onClick={onRemove}>
          {ui.delete}
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-[8rem_1fr]">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || uploadingFile}
          className="relative flex h-28 items-center justify-center overflow-hidden border border-dashed border-[var(--line)] bg-[#f8fafb]"
        >
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt="" className="h-full w-full object-contain p-1" />
          ) : (
            <span className="text-xs text-[var(--muted)]">+</span>
          )}
        </button>
        <div className="grid gap-2">
          <Field
            label={ui.servicesProductTitle}
            value={product.title}
            onChange={(v) => onChange({ ...product, title: v })}
          />
          <TextArea
            label={ui.servicesProductDesc}
            value={product.description}
            onChange={(v) => onChange({ ...product, description: v })}
            rows={3}
          />
          <div className="grid gap-1.5 border border-[var(--line)] bg-[#f8fafb] p-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-[var(--ink)]">{ui.servicesCatalog}</p>
              <p className="text-[11px] text-[var(--muted)]">{ui.servicesCatalogHint}</p>
            </div>
            {product.file ? (
              <p className="truncate text-xs text-[var(--muted)]">
                {product.fileName || product.file}
              </p>
            ) : (
              <p className="text-xs text-[var(--muted)]">{ui.servicesCatalogEmpty}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || uploadingFile}
                className="border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs hover:bg-white disabled:opacity-50"
              >
                {uploadingFile
                  ? ui.heroUploading
                  : product.file
                    ? ui.servicesCatalogChange
                    : ui.servicesCatalogPick}
              </button>
              {product.file ? (
                <button
                  type="button"
                  onClick={() => onChange({ ...product, file: "", fileName: "" })}
                  disabled={uploading || uploadingFile}
                  className="px-2.5 py-1.5 text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                  {ui.servicesCatalogRemove}
                </button>
              ) : null}
            </div>
          </div>
          {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadImage(file);
          e.target.value = "";
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,image/png,image/jpeg,image/webp,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadCatalog(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function CategoriesEditor({
  ui,
  items,
  brands,
  onChange,
}: {
  ui: AdminUi;
  items: ServiceCategoryItem[];
  brands: ServiceBrandItem[];
  onChange: (items: ServiceCategoryItem[]) => void;
}) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function updateCategory(index: number, patch: Partial<ServiceCategoryItem>) {
    onChange(items.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addBrandLink(index: number, slug: string) {
    if (!slug) return;
    const brand = brands.find((item) => item.slug === slug);
    if (!brand) return;
    const current = items[index];
    if (current.items.some((link) => link.slug === brand.slug)) return;
    updateCategory(index, {
      items: [
        ...current.items,
        { label: brand.brand || brand.slug, slug: brand.slug },
      ],
    });
  }

  async function uploadCategoryFile(index: number, file: File) {
    const category = items[index];
    setUploadError("");
    setUploadingId(category.id);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setUploadingId(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUploadError(data.error || "Upload failed");
      return;
    }
    const data = (await res.json()) as { url: string; fileName?: string };
    updateCategory(index, {
      file: data.url,
      fileName: data.fileName || file.name,
    });
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-primary text-sm"
          onClick={() => onChange([...items, emptyCategory()])}
        >
          {ui.servicesAddCategory}
        </button>
      </div>
      {items.map((item, index) => {
        const usedSlugs = new Set(item.items.map((link) => link.slug));
        const availableBrands = brands.filter(
          (brand) => brand.slug && !usedSlugs.has(brand.slug),
        );
        return (
          <div key={item.id} className="border border-[var(--line)] bg-[#f8fafb] p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[var(--muted)]">#{index + 1}</p>
              <div className="flex items-center gap-2">
                <MoveButtons
                  index={index}
                  total={items.length}
                  onMove={(direction) => onChange(moveItem(items, index, direction))}
                  labelUp={ui.servicesMoveUp}
                  labelDown={ui.servicesMoveDown}
                />
                <button
                  type="button"
                  className="text-xs text-red-600 hover:underline"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  {ui.delete}
                </button>
              </div>
            </div>
            <div className="grid gap-3">
              <Field
                label={ui.title}
                value={item.title}
                onChange={(v) => updateCategory(index, { title: v })}
              />
              <TextArea
                label={ui.body}
                value={item.description}
                onChange={(v) => updateCategory(index, { description: v })}
                rows={2}
              />

              <div className="grid gap-2 border border-[var(--line)] bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--ink)]">
                    {ui.servicesCategoryItems}
                  </p>
                  <p className="text-[11px] text-[var(--muted)]">
                    {ui.servicesCategoryLinksHint}
                  </p>
                </div>
                <select
                  className="w-full border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--navy)]"
                  value=""
                  onChange={(e) => {
                    addBrandLink(index, e.target.value);
                    e.target.value = "";
                  }}
                >
                  <option value="">{ui.servicesCategoryPick}</option>
                  {availableBrands.map((brand) => (
                    <option key={brand.id} value={brand.slug}>
                      {brand.brand || brand.slug} (/services/{brand.slug})
                    </option>
                  ))}
                </select>
                {item.items.length === 0 ? (
                  <p className="text-xs text-[var(--muted)]">{ui.none}</p>
                ) : (
                  <ul className="grid gap-1.5">
                    {item.items.map((link, linkIndex) => (
                      <li
                        key={`${item.id}-${link.slug}-${linkIndex}`}
                        className="flex flex-wrap items-center justify-between gap-2 border border-[var(--line)] bg-[#f8fafb] px-2.5 py-2"
                      >
                        <span className="min-w-0 truncate text-sm text-[var(--ink)]">
                          {link.label}
                          <span className="ml-2 text-xs text-[var(--muted)]">
                            /services/{link.slug}
                          </span>
                        </span>
                        <div className="flex items-center gap-1">
                          <MoveButtons
                            index={linkIndex}
                            total={item.items.length}
                            onMove={(direction) =>
                              updateCategory(index, {
                                items: moveItem(item.items, linkIndex, direction),
                              })
                            }
                            labelUp={ui.servicesMoveUp}
                            labelDown={ui.servicesMoveDown}
                          />
                          <button
                            type="button"
                            className="px-2 py-1 text-xs text-red-600 hover:underline"
                            onClick={() =>
                              updateCategory(index, {
                                items: item.items.filter((_, i) => i !== linkIndex),
                              })
                            }
                          >
                            {ui.delete}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid gap-1.5 border border-[var(--line)] bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--ink)]">
                    {ui.servicesCategoryFile}
                  </p>
                  <p className="text-[11px] text-[var(--muted)]">
                    {ui.servicesCategoryFileHint}
                  </p>
                </div>
                {item.file ? (
                  <p className="truncate text-xs text-[var(--muted)]">
                    {item.fileName || item.file}
                  </p>
                ) : (
                  <p className="text-xs text-[var(--muted)]">
                    {ui.servicesCategoryFileEmpty}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[item.id]?.click()}
                    disabled={uploadingId === item.id}
                    className="border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs hover:bg-[#f5f7f9] disabled:opacity-50"
                  >
                    {uploadingId === item.id
                      ? ui.heroUploading
                      : item.file
                        ? ui.servicesCategoryFileChange
                        : ui.servicesCategoryFilePick}
                  </button>
                  {item.file ? (
                    <button
                      type="button"
                      onClick={() => updateCategory(index, { file: "", fileName: "" })}
                      disabled={uploadingId === item.id}
                      className="px-2.5 py-1.5 text-xs text-red-600 hover:underline disabled:opacity-50"
                    >
                      {ui.servicesCategoryFileRemove}
                    </button>
                  ) : null}
                </div>
                <input
                  ref={(el) => {
                    fileInputRefs.current[item.id] = el;
                  }}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,image/png,image/jpeg,image/webp,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadCategoryFile(index, file);
                    e.target.value = "";
                  }}
                />
              </div>
              {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block min-w-0 text-sm font-medium text-[var(--ink)]">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full min-w-0 border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--navy)]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block min-w-0 text-sm font-medium text-[var(--ink)]">
      {label}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full min-w-0 resize-y border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--navy)]"
      />
    </label>
  );
}
