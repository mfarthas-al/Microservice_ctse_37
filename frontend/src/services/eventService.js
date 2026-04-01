import axios from "axios";
import { eventApiUrl, requireServiceUrl } from "../config/apiConfig";
import { getAuthHeaders } from "./authStorage";

// IMPORTANT: Event service must be configured for events UI. Do not throw at import-time;
// allow the app to boot and show a disabled state if the URL is missing.
const getBaseUrl = () => requireServiceUrl("Event service", eventApiUrl);

export const getEvents = async () => {
  const API_URL = getBaseUrl();
  return await axios.get(API_URL);
};

export const createEvent = async (eventData) => {
  const API_URL = getBaseUrl();
  return await axios.post(API_URL, eventData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const deleteEvent = async (id) => {
  const API_URL = getBaseUrl();
  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const uploadEventImage = async (file, folder = "ctse-events") => {
  const API_URL = getBaseUrl();
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
