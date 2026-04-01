import {
  enableBookingService,
  enableEventService,
  enableReviewService,
} from "./apiConfig";

/**
 * Service rollout flags are derived from frontend env config.
 *
 * TODO (future ALB migration):
 * - Set NEXT_PUBLIC_API_BASE_URL and keep this file unchanged.
 * - Or set each service URL directly (NEXT_PUBLIC_*_SERVICE_URL).
 */
export const EVENT_SERVICE_DEPLOYED = enableEventService;
export const BOOKING_SERVICE_DEPLOYED = enableBookingService;
export const REVIEW_SERVICE_DEPLOYED = enableReviewService;
