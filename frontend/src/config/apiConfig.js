const trimTrailingSlash = (value) => (value || "").replace(/\/$/, "");

const readEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }
  return "";
};

const boolFromEnv = (...keys) => {
  const value = readEnv(...keys).toLowerCase();
  if (!value) return undefined;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
};

const asApiBase = (raw, suffix) => {
  const value = trimTrailingSlash(raw);
  if (!value) return "";
  return value.endsWith(suffix) ? value : `${value}${suffix}`;
};

// Future-ready: NEXT_PUBLIC_API_BASE_URL can later point to a shared ALB.
const apiBase = trimTrailingSlash(
  readEnv("NEXT_PUBLIC_API_BASE_URL", "REACT_APP_API_BASE_URL")
);

const authServiceBase = apiBase
  ? `${apiBase}/api/auth`
  : asApiBase(
      readEnv("NEXT_PUBLIC_AUTH_SERVICE_URL", "REACT_APP_AUTH_SERVICE_URL"),
      "/api/auth"
    );

const eventServiceBase = apiBase
  ? `${apiBase}/api/events`
  : asApiBase(
      readEnv("NEXT_PUBLIC_EVENT_SERVICE_URL", "REACT_APP_EVENT_SERVICE_URL"),
      "/api/events"
    );

const bookingServiceBase = apiBase
  ? `${apiBase}/api/bookings`
  : asApiBase(
      readEnv("NEXT_PUBLIC_BOOKING_SERVICE_URL", "REACT_APP_BOOKING_SERVICE_URL"),
      "/api/bookings"
    );

const reviewServiceBase = apiBase
  ? `${apiBase}/api/reviews`
  : asApiBase(
      readEnv(
        "NEXT_PUBLIC_CUSTOMER_REVIEW_SERVICE_URL",
        "REACT_APP_CUSTOMER_REVIEW_SERVICE_URL",
        "REACT_APP_REVIEW_SERVICE_URL"
      ),
      "/api/reviews"
    );

export const authApiUrl = authServiceBase;
export const eventApiUrl = eventServiceBase;
export const bookingApiUrl = bookingServiceBase;
export const reviewApiUrl = reviewServiceBase;

export const isAuthServiceConfigured = Boolean(authApiUrl);
export const isEventServiceConfigured = Boolean(eventApiUrl);
export const isBookingServiceConfigured = Boolean(bookingApiUrl);
export const isReviewServiceConfigured = Boolean(reviewApiUrl);

export const enableEventService =
  boolFromEnv("NEXT_PUBLIC_ENABLE_EVENT_SERVICE", "REACT_APP_ENABLE_EVENT_SERVICE") ??
  isEventServiceConfigured;
export const enableBookingService =
  boolFromEnv("NEXT_PUBLIC_ENABLE_BOOKING_SERVICE", "REACT_APP_ENABLE_BOOKING_SERVICE") ??
  isBookingServiceConfigured;
export const enableReviewService =
  boolFromEnv("NEXT_PUBLIC_ENABLE_REVIEW_SERVICE", "REACT_APP_ENABLE_REVIEW_SERVICE") ??
  isReviewServiceConfigured;

export const requireServiceUrl = (serviceName, serviceUrl) => {
  if (!serviceUrl) {
    const error = new Error(`${serviceName} is not configured`);
    error.code = "SERVICE_NOT_CONFIGURED";
    throw error;
  }
  return serviceUrl;
};
