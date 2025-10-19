# BookingTour Admin Dashboard

Operational dashboard for the BookingTour platform – empowers concierge and admin teams to run the business. Built with **React 18**, **Vite**, **Tailwind CSS**, **React Router**, **React Hook Form**, and **Recharts**. Uses rich mock data mirroring backend structures so API integration is straightforward.

## Highlights

- **Control center**: analytics overview, live booking feed, performance insights.
- **Full CRUD skeletons**: tour catalog management, booking lifecycle pages, review moderation, role management, and settings forms.
- **Admin-friendly UX**: collapsible sidebar, glassmorphism accents, responsive tables with actions, data visualizations.
- **Form-ready**: Tour create/edit pages use `react-hook-form` with dynamic arrays for highlights/tags and validation hints.
- **Scalable architecture**: component folders per domain (dashboard, tours, bookings, users, reviews) and centralized mock data.

## Run It

```bash
pnpm install
pnpm dev -- --port 5174
```

> Adjust ports or package managers as needed. All commands mirror the standard Vite workflow.

## Directory Overview

```
frontend-admin/
├── public/            # Favicon & static assets
├── src/
│   ├── components/
│   │   ├── bookings/  # Booking table, timeline
│   │   ├── common/    # Reusable buttons, cards, tables, status pills
│   │   ├── dashboard/ # Stat cards, charts, summaries
│   │   ├── reviews/   # Review moderation list
│   │   └── tours/     # Tour table + create/edit form
│   ├── data/          # Mock datasets mapping to backend entities
│   ├── layouts/       # Admin shell with sidebar/topbar
│   ├── pages/         # Dashboard, Tours, Bookings, Users, Reviews, Settings, Login
│   ├── styles/        # Tailwind + custom utilities
│   ├── App.jsx        # Routes
│   └── main.jsx       # Entry point
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Next Steps for Integration

1. **Auth guard**: Protect routes using JWT/cookie session from backend auth service.
2. **Data fetching**: Replace mock imports with `fetch`/`axios` calls (`/admin/tours`, `/admin/bookings`, etc.) and add loading/error states.
3. **Mutations**: Wire `TourForm`, booking status buttons, and review moderation actions to POST/PUT endpoints.
4. **Real-time updates**: Subscribe to websockets/webhooks to keep dashboard cards and tables in sync.
5. **Role-based access**: Update sidebar/menu visibility based on authenticated user role.

## Design Language

- Neutral slate palette with primary blues for actionable moments.
- Dense, data-first UI with clear hierarchy for mission-critical workflows.
- Reusable badges/pills for status transitions mirroring backend state machines.

Feel free to extend components, connect analytics, or integrate notifications (Slack, email) as you hook it up to production services.
