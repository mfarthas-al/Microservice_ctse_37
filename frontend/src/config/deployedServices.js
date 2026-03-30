/**
 * Microservice rollout — flip each flag to `true` after that service is live behind
 * the API gateway (and nginx `location /api/...` routes to the service).
 *
 * Auth at `/api/auth` is always used when the app points at the gateway; these flags only
 * gate UI sections (events list, booking modal/list, reviews) so you could ship incrementally.
 *
 * Set to `true` when the gateway proxies:
 * - `/api/events` → event-service
 * - `/api/bookings` → booking-service
 * - `/api/reviews` → customer-review-service
 */
export const EVENT_SERVICE_DEPLOYED = true;
export const BOOKING_SERVICE_DEPLOYED = true;
export const REVIEW_SERVICE_DEPLOYED = false;
