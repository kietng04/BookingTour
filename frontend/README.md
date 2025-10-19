# BookingTour Frontend (Customer UI)

Modern customer-facing experience for the tour booking platform. Built with **React 18**, **Vite**, **Tailwind CSS**, and **React Router** using mock data that mirrors backend entities.

## Key Features

- **End-to-end journey**: browse tours, view detailed itineraries, submit bookings, manage profile & review payment states.
- **Dedicated reviews hub**: aggregate verified testimonials with rating breakdowns, filters by tour/badge, and marketing-ready storytelling.
- **Componentized design system**: reusable buttons, inputs, badges, cards, skeletons, and responsive layout components.
- **Delightful UX**: polished typography, glassmorphism touches, responsive hero sections, loading placeholders, and empty states.
- **Mock data ready for API swap**: all data references are centralized under `src/data/*`. Replace with real API calls when backend endpoints are available.
- **Router structure**: pages live under `src/pages` and line up with expected backend routes (`/tours`, `/booking/:id`, `/profile`, etc.).

## Getting Started

```bash
pnpm install
pnpm dev
```

> Any Node.js package manager works (`npm`, `yarn`). Commands mirror the Vite defaults.

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── booking/        // Booking form, summary, timeline
│   │   ├── common/         // Shared UI primitives
│   │   ├── layout/         // Header, footer, responsive nav
│   │   ├── reviews/        // Review summary, filters, list
│   │   └── tour/           // Cards, filters, itinerary, reviews
│   ├── data/               // Mock data for tours, bookings, users
│   ├── layouts/            // Main layout wrapping routes
│   ├── pages/              // Feature pages
│   ├── styles/             // Tailwind + global enhancements
│   ├── App.jsx             // Route definitions
│   └── main.jsx            // React entry point
├── index.html              // Vite template
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Next Steps (Backend Integration)

1. Configure environment variables for API URL & auth tokens.
2. Swap mock data with real fetch hooks (`/tours`, `/bookings`, `/reviews`, `/users/me`).
3. Connect booking form to `POST /bookings` and payment status endpoints.
4. Wire authentication (JWT/OAuth) & guard routes like `/profile`.
5. Add analytics/events tracking (`tour_view`, `booking_request`).

## Design System Notes

- Colors and fonts align with a boutique-luxury travel aesthetic.
- Tailwind config extends utilities for shadows, gradients, and brand colors.
- Components are accessible: focus states, aria labels, descriptive alt text.

Happy travels! ✈️
