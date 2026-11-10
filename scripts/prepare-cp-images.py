from pathlib import Path
import pymupdf
from PIL import Image

hero = Path(r"d:\Software Project\Hankook Service Center\public\images\hero")
products = Path(r"d:\Software Project\Hankook Service Center\public\images\products")
products.mkdir(parents=True, exist_ok=True)

for pdf_name, out_name in [
    ("cp-75-220.pdf", "cp-75-220.jpg"),
    ("cp-cpc-40-60.pdf", "cp-cpc-40-60.jpg"),
]:
    doc = pymupdf.open(hero / pdf_name)
    page = doc[0]
    pix = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
    out = hero / out_name
    pix.save(str(out))
    doc.close()
    print("pdf", out_name, out.stat().st_size)

conversions = [
    ("cp-cpf221.png", "cp-cpf221.jpg"),
    ("cp-cpm60.webp", "cp-cpm60.jpg"),
    ("cp-piston.webp", "cp-piston.jpg"),
    ("cp-oil-free.jpg", "cp-oil-free.jpg"),
    ("cp-75-220.jpg", "cp-75-220.jpg"),
    ("cp-cpc-40-60.jpg", "cp-cpc-40-60.jpg"),
]

for src_name, dst_name in conversions:
    src = hero / src_name
    if not src.exists():
        print("missing", src_name)
        continue
    img = Image.open(src).convert("RGB")
    w, h = img.size
    if max(w, h) < 900:
        scale = 900 / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    dst = hero / dst_name
    img.save(dst, "JPEG", quality=88, optimize=True)
    prod = products / f"chicago-pneumatic--{dst_name.replace('cp-', '')}"
    img.save(prod, "JPEG", quality=88, optimize=True)
    print("img", dst_name, dst.stat().st_size, "->", prod.name)

for pdf in hero.glob("*.pdf"):
    pdf.unlink()
    print("removed", pdf.name)

# Remove intermediate formats not needed for web
for name in ["cp-cpf221.png", "cp-cpm60.webp", "cp-piston.webp"]:
    path = hero / name
    if path.exists():
        path.unlink()
        print("removed", name)
