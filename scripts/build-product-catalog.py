import json
import re
from pathlib import Path

import fitz
from PIL import Image
from pypdf import PdfReader

ROOT = Path(
    r"C:\Users\NXTGN-PC\Dropbox\06.Hankook Service Center\a.Company overview\Document For Websites"
)
OUT_IMG = Path("public/images/products")
OUT_IMG.mkdir(parents=True, exist_ok=True)

FOLDERS = {
    "Alisha": {"slug": "alisha", "group": "compressors", "brand": "Alisha"},
    "Atlas Copco Air Compressor": {
        "slug": "atlas-copco",
        "group": "compressors",
        "brand": "Atlas Copco",
    },
    "CP Air Compressor": {
        "slug": "chicago-pneumatic",
        "group": "compressors",
        "brand": "Chicago Pneumatic",
    },
    "ELGI Air Compressor": {"slug": "elgi", "group": "compressors", "brand": "ELGI"},
    "FS Air Compressor": {"slug": "fs-curtis", "group": "compressors", "brand": "FS Curtis"},
    "Ingersoll Rand Air Compressor": {
        "slug": "ingersoll-rand",
        "group": "compressors",
        "brand": "Ingersoll Rand",
    },
    "Oil": {"slug": "oil", "group": "oil", "brand": "Klüber Summit"},
    "Summits": {"slug": "summit", "group": "air-treatment", "brand": "Summit"},
    "DG": {"slug": "dg", "group": "power", "brand": "Kirloskar"},
    "UPS": {"slug": "ups", "group": "power", "brand": "SBN Tech"},
    "Hankook": {
        "slug": "hankook",
        "group": "company",
        "brand": "Hankook Service Center",
    },
}


def slugify(name: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", name).strip("-").lower()
    return s[:80] or "doc"


def clean_text(t: str) -> str:
    t = t.replace("\x00", " ")
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def extract_pdf_text(path: Path, max_pages: int = 2) -> str:
    try:
        reader = PdfReader(str(path))
        parts = []
        for page in reader.pages[:max_pages]:
            parts.append(page.extract_text() or "")
        return clean_text("\n".join(parts))
    except Exception:
        return ""


def render_pdf_cover(path: Path, out: Path, max_w: int = 1100) -> None:
    doc = fitz.open(str(path))
    page = doc[0]
    zoom = min(1.6, max_w / page.rect.width)
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, int(img.height * ratio)), Image.Resampling.LANCZOS)
    img.save(out, "JPEG", quality=82, optimize=True)
    doc.close()


def main() -> None:
    catalog = []
    for folder, meta in FOLDERS.items():
        folder_path = ROOT / folder
        if not folder_path.exists():
            print("missing", folder)
            continue

        products = []
        for f in sorted(folder_path.iterdir()):
            if not f.is_file():
                continue
            ext = f.suffix.lower()
            if ext not in {".pdf", ".jpg", ".jpeg", ".png", ".webp"}:
                continue

            key = slugify(f.stem)
            img_name = f"{meta['slug']}--{key}.jpg"
            img_path = OUT_IMG / img_name
            title = re.sub(r"[_\-]+", " ", f.stem)
            title = re.sub(r"\s+", " ", title).strip()
            desc = ""

            try:
                if ext == ".pdf":
                    if not img_path.exists() or img_path.stat().st_size < 1000:
                        render_pdf_cover(f, img_path)
                    desc = extract_pdf_text(f, 2)
                else:
                    im = Image.open(f).convert("RGB")
                    max_w = 1100
                    if im.width > max_w:
                        ratio = max_w / im.width
                        im = im.resize(
                            (max_w, int(im.height * ratio)), Image.Resampling.LANCZOS
                        )
                    im.save(img_path, "JPEG", quality=82, optimize=True)
                    desc = "Product brochure."

                short = desc
                if len(short) > 700:
                    short = short[:680].rsplit(" ", 1)[0] + "…"

                products.append(
                    {
                        "id": key,
                        "title": title,
                        "fileName": f.name,
                        "image": f"/images/products/{img_name}",
                        "description": short,
                    }
                )
                print("OK", meta["slug"], f.name, "->", img_name)
            except Exception as exc:
                print("FAIL", f.name, type(exc).__name__, exc)

        catalog.append({**meta, "folder": folder, "products": products})

    out_json = Path("src/data/product-catalog.json")
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    print("catalog", len(catalog), "images", len(list(OUT_IMG.glob("*.jpg"))))


if __name__ == "__main__":
    main()
