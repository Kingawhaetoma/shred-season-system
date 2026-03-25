# Discipline Cut

Personal weight loss accountability app built with:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma with Supabase Postgres
- Recharts

## What it does

- Tracks daily weight, calories, protein, steps, water, fasting hours, plan adherence, and night eating
- Scores each day from 0-5 based on consistency
- Shows a dashboard with today&apos;s score, streak, fast timer, weekly goal progress, and danger alerts
- Visualizes weight and calorie trends
- Summarizes the last 7 days with weekly review metrics and habit hit rates

## Run it

```bash
npm install
export DATABASE_URL="your-supabase-postgres-url"
npm run db:migrate
npm run db:seed
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:migrate
npm run db:push
npm run db:seed
```

## Notes

- The app is single-user and does not include authentication.
- Sample data can be seeded into your configured Postgres database after migration.
- Prisma reads `DATABASE_URL` from the environment via `prisma.config.ts`.
