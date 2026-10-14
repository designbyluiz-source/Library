# Library Events Dash — running prototype

A local-data React prototype for reviewing the library event browsing experience. This is the first prototype for review, not the final design documentation.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL shown by Vite. `npm run build` creates the production files in `dist`; `npm run preview` serves that build. `npm test` runs the browsing/date-logic tests.

## Review context

- Fictional Maple County library system, 12 branches, and local sample events across 2026.
- First access starts in **Table / This week / All branches** to support scanning current work. Subsequent browsing preserves the selected representation; Calendar remains complementary.
- Fixed review time: **October 6, 2026, 10:30 AM Eastern**. This keeps current/upcoming states reproducible. Dates are mock library wall-clock values; no external timezone service is used.
- Monday-start weeks. Attention means temporal relevance, with no operational alert/readiness rules.
- Branch, date, search, status, and event-type selections are shared by Table and Calendar. Calendar shows a week or month within the matching dataset; empty periods offer **View matching dates**.
- Browse selections persist in the current browser tab. Event links use hash navigation; Back restores browsing context.
- `/` focuses the visible search input. Standard keyboard navigation, Escape dismissal, and visible focus are supported.
- Use the event-count button above a calendar day to inspect all of that day's matching events.
- Weekly Calendar keeps seven day columns on desktop. At narrower day widths, overlapping time slots become clickable groups with a full event list; at viewport widths of 1000 px or less, the week uses a day-by-day agenda. Overlaps are not classified as scheduling conflicts.
- **Draft**, Scheduled, Completed, and Cancelled are mock lifecycle labels, separate from the date-based timing labels. No approval, preparation, or action-required rules are implemented.
- Table sorting offers the existing relevance order and either chronological direction. **Created by** and **Notes** use fictional local sample staff and annotations; note counts open a read-only popover.
- The tour appears on first access and stays dismissed after completing or skipping it. **Profile → Take a tour** reopens it. This preference uses local browser storage, with no account or authentication service.
- At constrained heights, the controls have their own scroll region so results retain usable space. An outer content-scroll fallback applies below 420 px; the sidebar and category legend remain fixed.

## Implementation

React, TypeScript, Vite, Tailwind CSS, source-owned shadcn/ui-style Radix primitives, Lucide, date-fns, and local mock data. No backend, authentication, database, or external event service.

- `src/data/events.ts`: sample branches, events, and review clock
- `src/lib/events.ts`: filtering, timing, sorting, and date scopes
- `src/components/`: browse controls, representations, and UI primitives
- `src/App.tsx`: workspace state and lightweight event navigation
- `tests/events.test.ts`: core behavior and date-boundary checks

## Vercel readiness

Use the Vite framework preset, build command `npm run build`, and output directory `dist`. No environment variables are required. The prototype has not been published.

Figma reconstruction and final design documentation remain gated on user approval.
