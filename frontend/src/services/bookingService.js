import axios from "axios";
import { bookingApiUrl, requireServiceUrl } from "../config/apiConfig";
import { getAuthHeaders } from "./authStorage";

// IMPORTANT: Booking service is optional. Do not throw at import-time; only error when called.
const getBaseUrl = () => requireServiceUrl("Booking service", bookingApiUrl);

export const createBooking = async (bookingData) => {
  const API_URL = getBaseUrl();
  return await axios.post(API_URL, bookingData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const getBookings = async () => {
  const API_URL = getBaseUrl();
  return await axios.get(API_URL, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const getBookedSeats = async (eventId) => {
  const API_URL = getBaseUrl();
  return await axios.get(`${API_URL}/event/${eventId}/seats`);
};

export const deleteBooking = async (id) => {
  const API_URL = getBaseUrl();
  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const uploadBannerImage = async (file) => {
  const API_URL = getBaseUrl();
  const formData = new FormData();
  formData.append("image", file);

  return await axios.post(`${API_URL}/banner/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getBannerImage = async () => {
  const API_URL = getBaseUrl();
  return await axios.get(`${API_URL}/banner`);
};

export const updateBannerImage = async (imageUrl) => {
  const API_URL = getBaseUrl();
  return await axios.put(
    `${API_URL}/banner`,
    { imageUrl },
    {
      headers: {
        ...getAuthHeaders(),
      },
    }
  );
};