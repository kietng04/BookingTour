# UI/UX Enhancement Plan for BookingTour Frontend

## Overview
- Scope: pages `frontend/src/pages/HomePage.tsx`, `TourDetailPage.tsx`, `BookingPage.tsx`, header/footer components, and supporting UI components.
- Goals: improve clarity, consistency, accessibility, loading states, and error handling without changing API contracts.

## Findings
- HomePage
  - Error banner shows generic message and empty grid; provide retry and graceful fallbacks when API is down (503).
  - Tours grid uses card skeletons but top hero/search area has no loading indicator.
  - Filter badge count is good; lack of “clear filters” affordance.
  - CTA button copy could clarify action (e.g., “Tìm tour phù hợp” becomes “Tìm tour” on small widths).
- TourDetailPage
  - Gallery controls lack focus styles and ARIA labels for accessibility.
  - Departure list lacks semantic labels for status (“Còn chỗ/Sắp đầy/Đã đầy”).
  - BookingSidebar totals hard-coded fee labels; clarify pricing breakdown and currency formatting; ensure keyboard navigation.
- BookingPage
  - Two-step flow is clear; add validation messages and disabled state to “Tiếp tục thanh toán” until required fields filled.
  - API errors should surface inline and allow retry.
  - Departure selector needs selected state contrast and accessible name.
- Global
  - Header skip link present; ensure focus ring visibility across interactive elements.
  - Use consistent number/currency formatting via Intl across components.

## Enhancements (Implementation Checklist)
1. Add global Toast + Retry for API errors in `HomePage` and `TourDetailPage`.
2. Add loading state overlay for search results on HomePage.
3. Add “Clear filters” control next to filter button.
4. Strengthen accessibility: ARIA labels, focus-visible styles for gallery buttons and nav links.
5. Refactor `BookingSidebar` price breakdown to use Intl and clearer labels.
6. In `BookingPage`, gate “Tiếp tục thanh toán” button until contact fields valid; add inline errors and retry.
7. Ensure components handle 0 results gracefully with suggestions.

## Acceptance Criteria
- No change to API endpoints or payloads.
- Pages function with degraded backend (503) showing actionable UI: retry and helpful messages.
- Keyboard navigation works for gallery, filters, departure selection, and CTA buttons; focus is visible.
- Price and totals consistently formatted in `vi-VN` currency.

## Testing Notes
- Simulate 503 from `/api/tours` and verify HomePage shows retry and suggestions.
- Navigate: `/`, `/tours/ha-noi-ha-long-3n2d`, `/booking/ha-noi-ha-long-3n2d` and validate focus traps and tab order.
- Verify no changes to fetch URLs or request bodies.

