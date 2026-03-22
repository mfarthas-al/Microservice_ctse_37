const trimTrailingSlash = (value) => (value || "").replace(/\/$/, "");

const gateway = trimTrailingSlash(process.env.REACT_APP_API_GATEWAY_URL || "");

/**
 * HTTPS pages (Amplify) cannot call http:// APIs. Use same-origin `/api/*` + Amplify rewrite
 * to `http://<gateway>/api/<*>` (200), or set REACT_APP_API_GATEWAY_URL to https://...
 *
 * Auto: production build + gateway URL is http:// → use relative `/api/...` (rewrite required).
 * Opt out: REACT_APP_RELATIVE_API=false
 */
const explicitRelative =
  process.env.REACT_APP_RELATIVE_API === "true" ||
  process.env.REACT_APP_RELATIVE_API === "1";

const relativeOptOut = process.env.REACT_APP_RELATIVE_API === "false";

const autoRelativeForHttpGateway =
  process.env.NODE_ENV === "production" &&
  Boolean(gateway) &&
  gateway.startsWith("http://");

const relativeApi =
  !relativeOptOut &&
  (explicitRelative || autoRelativeForHttpGateway);

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
