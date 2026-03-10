import axios from "axios";

const API_URL = "http://localhost:5002/api/bookings";

export const createBooking = async (bookingData) => {
  return await axios.post(API_URL, bookingData);
};

export const getBookings = async () => {
  return await axios.get(API_URL);
};

export const getBookedSeats = async (eventId) => {
  return await axios.get(`${API_URL}/event/${eventId}/seats`);
};

export const deleteBooking = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
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
  return await axios.put(`${API_URL}/banner`, { imageUrl });
};