# Event Booking System

Build a complete, responsive event booking experience using the existing TanStack React app, with the home screen as the starting point.

## Experience
- Create a distinctive editorial events interface with event discovery, search, category/date/price filters, and sample events.
- Provide event details and validated ticket checkout, then show a booking confirmation.
- Add My Bookings and an Admin Dashboard with useful event and booking summaries.
- Support smooth navigation, accessible controls, responsive layouts, and clear empty states.

## Persistence and validation
- Store bookings and admin-managed event changes in browser localStorage, with safe client-side hydration and sensible handling of invalid stored data.
- Validate booking inputs and ticket availability before confirming.

## Technical details
- Use the existing TanStack Start, route files, shadcn controls, and semantic CSS tokens; do not introduce another framework or backend.
- Add route-specific metadata for each content page, focused tests for booking validation/persistence rules, and verify the main discovery-to-confirmation flow in the running preview.
