import axios from "axios";
import { eventApiUrl, requireServiceUrl } from "../config/apiConfig";
import { getAuthHeaders } from "./authStorage";

const API_URL = requireServiceUrl("Event service", eventApiUrl);

export const getEvents = async () => {
  return await axios.get(API_URL);
};

export const createEvent = async (eventData) => {
  return await axios.post(API_URL, eventData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const deleteEvent = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const uploadEventImage = async (file, folder = "ctse-events") => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  return await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      ...getAuthHeaders(),
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
