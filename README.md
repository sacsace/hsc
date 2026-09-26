# Hankook Service Center Company Website

Simple corporate site for **Hankook Service Center Pvt. Ltd.** with an admin panel for content editing.

Repository: [https://github.com/sacsace/hsc](https://github.com/sacsace/hsc)

## Quick start

```bash
npm install
npm run dev
```

- Site: [http://localhost:3500](http://localhost:3500)
- Admin: [http://localhost:3500/admin](http://localhost:3500/admin)

Default admin password: `hankook@2026` (change in admin **보안** menu or `.env.local`)

## Environment

```env
NEXT_PUBLIC_SITE_URL=https://hksc.in
NEXT_PUBLIC_MVS_URL=https://www.mvsystem.in
ADMIN_PASSWORD=hankook@2026
ADMIN_SECRET=your-random-secret
# Optional override for persistent storage (defaults to ./data locally,
# or RAILWAY_VOLUME_MOUNT_PATH on Railway)
# DATA_DIR=/data

# Optional Google SMTP fallback (prefer Admin → 메일 설정 UI)
# SMTP_ENABLED=true
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=465
# SMTP_SECURE=true
# SMTP_USER=you@gmail.com
# SMTP_PASS=your-16-char-app-password
# SMTP_FROM_NAME=Hankook Service Center
# SMTP_FROM_EMAIL=you@gmail.com
# MAIL_TO=hyun.hs@hksc.in
```

After changing the password in the admin UI, it is stored in `data/admin.json` (not committed to git).

**Inquiry email:** open Admin → **메일 설정**, enable sending, enter Gmail + [App Password](https://myaccount.google.com/apppasswords), set recipient, then **테스트 메일 보내기**. Settings are saved in `data/mail.json` (gitignored / volume).

## Content & uploads (persistence)

Editable JSON lives under the data directory (`content.json`, `inquiries.json`).  
Admin image uploads are stored in `data/uploads/` and served at `/uploads/...`.

**Railway (required for production):** redeploy wipes the container filesystem. Attach a **Volume** so CMS edits and uploaded images survive:

1. Railway project → service → **Volumes** → Add Volume
2. Mount path: `/data` (do **not** use `/app/data` — that hides the seeded `content.json` in the image)
3. Redeploy

Railway sets `RAILWAY_VOLUME_MOUNT_PATH=/data` automatically. The app then reads/writes:

- `/data/content.json` — CMS content
- `/data/inquiries.json` — contact inquiries
- `/data/admin.json` — admin password hash
- `/data/mail.json` — Google SMTP settings
- `/data/uploads/*` — uploaded images

On first boot with an empty volume, `content.json` is copied from the image seed.

Static brand assets (logo, favicon, hero videos under `public/images`, `public/videos`) stay in git and are fine without a volume.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

Developed by [Minsub Ventures](https://www.msventures.in/).
