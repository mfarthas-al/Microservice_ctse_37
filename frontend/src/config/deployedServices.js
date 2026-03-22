/**
 * Microservice rollout — flip each flag to `true` after that service is live behind
 * the API gateway (and nginx `location /api/...` is uncommented/configured).
 *
 * Auth (user-management) at /api/auth is assumed available when the gateway is deployed.
 *
 * TODO: EVENT_SERVICE_DEPLOYED → true after event-service + gateway route
 * TODO: BOOKING_SERVICE_DEPLOYED → true after booking-service + gateway route
 * TODO: REVIEW_SERVICE_DEPLOYED → true after customer-review-service + gateway route
 */
export const EVENT_SERVICE_DEPLOYED = false;
export const BOOKING_SERVICE_DEPLOYED = false;
export const REVIEW_SERVICE_DEPLOYED = false;
