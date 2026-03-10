import axios from "axios";

const API_URL = "http://localhost:5002/api/bookings";

export const createBooking = async (bookingData) => {
  return await axios.post(API_URL, bookingData);
};

export const getBookings = async () => {
  return await axios.get(API_URL);
};

export const deleteBooking = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};