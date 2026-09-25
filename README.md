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

