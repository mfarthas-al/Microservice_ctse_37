import axios from "axios";
import { reviewApiUrl, requireServiceUrl } from "../config/apiConfig";
import { getAuthHeaders } from "./authStorage";

// IMPORTANT: Review service is optional. Do not throw at import-time; only error when called.
const getBaseUrl = () => requireServiceUrl("Customer review service", reviewApiUrl);

export const getReviews = async (eventId) => {
  const API_URL = getBaseUrl();
  return await axios.get(API_URL, { params: { eventId } });
};

export const createReview = async (reviewData) => {
  const API_URL = getBaseUrl();
  return await axios.post(API_URL, reviewData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const deleteReview = async (id) => {
  const API_URL = getBaseUrl();
  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};
