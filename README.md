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

Default admin password: `admin1234` (change in `.env.local`)

## Environment

```env
ADMIN_PASSWORD=admin1234
ADMIN_SECRET=your-random-secret
```

## Content

Editable JSON lives in `data/content.json`. The admin UI reads/writes this file via `/api/content`.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

Developed by [Minsub Ventures](https://www.msventures.in/).
