const trimTrailingSlash = (value) => (value || "").replace(/\/$/, "");

const gateway = trimTrailingSlash(process.env.REACT_APP_API_GATEWAY_URL);

/**
 * When REACT_APP_API_GATEWAY_URL is set (e.g. http://localhost:8080), all API
 * calls go through the gateway. Otherwise use per-service URLs (direct to each port).
 */
export const eventApiUrl =
  gateway
    ? `${gateway}/api/events`
    : process.env.REACT_APP_EVENT_API_URL || "http://localhost:3002/api/events";

export const bookingApiUrl =
  gateway
    ? `${gateway}/api/bookings`
    : process.env.REACT_APP_BOOKING_API_URL || "http://localhost:3003/api/bookings";

export const authApiUrl =
  gateway
    ? `${gateway}/api/auth`
    : process.env.REACT_APP_AUTH_API_URL || "http://3.110.27.117:3001//api/auth";

export const reviewApiUrl =
  gateway
    ? `${gateway}/api/reviews`
    : process.env.REACT_APP_REVIEW_API_URL || "http://localhost:3004/api/reviews";
