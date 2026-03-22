const trimTrailingSlash = (value) => (value || "").replace(/\/$/, "");

/**
 * Production on Amplify (HTTPS): the browser blocks http:// API calls (mixed content).
 *
 * Option A — HTTPS on your gateway: set REACT_APP_API_GATEWAY_URL=https://your-domain
 *
 * Option B — Same-origin proxy (no TLS on EC2): set REACT_APP_RELATIVE_API=true
 * and in Amplify Console → Hosting → Rewrites and redirects add:
 *   Source: /api/<*>
 *   Target: http://13.126.11.22/api/<*>
 *   Type: Rewrite (200)
 *
 * Local dev: leave unset; uses REACT_APP_API_GATEWAY_URL or defaults below.
 */
const relativeApi =
  process.env.REACT_APP_RELATIVE_API === "true" ||
  process.env.REACT_APP_RELATIVE_API === "1";

const gateway = trimTrailingSlash(process.env.REACT_APP_API_GATEWAY_URL || "");

export const eventApiUrl = relativeApi
  ? "/api/events"
  : gateway
  ? `${gateway}/api/events`
  : process.env.REACT_APP_EVENT_API_URL || "http://localhost:3002/api/events";

export const bookingApiUrl = relativeApi
  ? "/api/bookings"
  : gateway
  ? `${gateway}/api/bookings`
  : process.env.REACT_APP_BOOKING_API_URL || "http://localhost:3003/api/bookings";

export const authApiUrl = relativeApi
  ? "/api/auth"
  : gateway
  ? `${gateway}/api/auth`
  : process.env.REACT_APP_AUTH_API_URL || "http://localhost:3001/api/auth";

export const reviewApiUrl = relativeApi
  ? "/api/reviews"
  : gateway
  ? `${gateway}/api/reviews`
  : process.env.REACT_APP_REVIEW_API_URL || "http://localhost:3004/api/reviews";
