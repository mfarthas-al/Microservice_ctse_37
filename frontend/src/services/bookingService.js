import axios from "axios";
import { bookingApiUrl, requireServiceUrl } from "../config/apiConfig";
import { getAuthHeaders } from "./authStorage";

const API_URL = requireServiceUrl("Booking service", bookingApiUrl);

export const createBooking = async (bookingData) => {
  return await axios.post(API_URL, bookingData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const getBookings = async () => {
  return await axios.get(API_URL, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const getBookedSeats = async (eventId) => {
  return await axios.get(`${API_URL}/event/${eventId}/seats`);
};

export const deleteBooking = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const uploadBannerImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return await axios.post(`${API_URL}/banner/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getBannerImage = async () => {
  return await axios.get(`${API_URL}/banner`);
};

export const updateBannerImage = async (imageUrl) => {
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