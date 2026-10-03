# Real Estate Listings Platform with Custom Admin CMS

Built a full-stack property listings platform end-to-end for an independent real estate agent, from data model to production deployment. Designed a lightweight custom CMS instead of adapting an off-the-shelf real estate template, giving the client full control over listings, photos, and pricing without any third-party dependency. For the watermarking requirement — initially a simple logo overlay — built a tiled-pattern generator (Sharp) that repeats a small mark across any photo dimension, replacing a naive single-corner stamp that was easy to crop out. Also implemented a serverless-friendly lead pipeline: form submissions are validated, rate-limited, and pushed to the agent's Telegram in real time instead of routing through email, matching how a single-person business actually checks messages throughout the day.

- A fork-per-client Next.js real estate listing template with a custom admin CMS — property catalog, photo watermarking, lead capture, and site branding, all configurable per deployment.

```
Next.js TypeScript PostgreSQL Prisma Tailwind CSS NextAuth.js Cloudinary
```

# Framework NextJS

https://nextjs.org/

# Next Auth

https://next-auth.js.org/

# inquirer for interactive questions in the terminal

## Deploying for a new client (fork checklist)

1. **Fork the repo** — `git clone` into a new directory, rename remote if needed.

2. **Neon (database)**
   - Create a new Neon project, region closest to the client's audience
   - Copy both the pooled and direct (unpooled) connection strings

3. **Local setup**
   - `yarn install`
   - Copy `.env.example` to `.env`, fill in `DATABASE_URL` and `DIRECT_URL`
   - Generate `AUTH_SECRET`: `npx auth secret`
   - `yarn prisma migrate dev` — applies all migrations to the fresh database

4. **Cloudinary (photos + watermark)**
   - Create a new Cloudinary account, use the **Root** API key (not a scoped key —
     scoped keys can silently lack upload permissions, cost us a debugging session once)
   - Upload the client's watermark asset with a fixed `public_id`
   - Fill `CLOUDINARY_*` vars in `.env`

5. **Resend (password reset email)**
   - Create account, get API key
   - Until a custom domain is verified, password reset only works for the
     email the Resend account was registered with — fine for a single admin

6. **Telegram (lead notifications)**
   - Create a bot via @BotFather, message it once (`/start`)
   - Get chat_id via `https://api.telegram.org/bot<token>/getUpdates`
   - Fill `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

7. **Onboarding script**
   - `npx tsx prisma/onboard.ts` — sets site name, contact info, and creates
     the client's real admin account (not the dev seed's test credentials)

8. **Vercel**
   - Import the repo, set **every** env var from `.env` in project settings
   - `postinstall: prisma generate` is already in `package.json`, no extra setup
   - Deploy, verify photo upload works from the deployed URL (not just localhost)

9. **Branding**
   - Log in to `/admin/settings`, set accent color and upload the client's logo

10. **Domain** (optional) — Vercel → Domains → add, update DNS at the registrar
