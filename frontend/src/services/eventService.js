import axios from "axios";

const API_URL = "http://localhost:5001/api/events";

export const getEvents = async () => {
  return await axios.get(API_URL);
};

export const createEvent = async (eventData) => {
  return await axios.post(API_URL, eventData);
};

export const deleteEvent = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export const uploadEventImage = async (file, folder = "ctse-events") => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  return await axios.post(`${API_URL}/upload`, formData, {
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
