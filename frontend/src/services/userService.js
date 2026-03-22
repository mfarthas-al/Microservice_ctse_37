import axios from "axios";
import { getAuthHeaders } from "./authStorage";

const API_URL =
  process.env.REACT_APP_AUTH_API_URL || "http://localhost:3001/api/auth";

const normalizeAuthResponse = (responseData) => {
  const payload = responseData?.data || responseData;
  const user = payload?.user || payload;

  return {
    user: {
      ...user,
      id: user?.id || user?._id,
      _id: user?._id || user?.id,
    },
    accessToken: payload?.accessToken || "",
    refreshToken: payload?.refreshToken || "",
  };
};

const withAuthHeaders = () => ({
  headers: {
    ...getAuthHeaders(),
  },
});

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return normalizeAuthResponse(response.data);
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return normalizeAuthResponse(response.data);
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
  return {
    accessToken: response?.data?.data?.accessToken || "",
    refreshToken: response?.data?.data?.refreshToken || "",
  };
};

export const logoutUser = async (refreshToken) => {
  return await axios.post(`${API_URL}/logout`, { refreshToken });
};

export const getMyProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, withAuthHeaders());
  const profile = response?.data?.data || null;

  return {
    ...response,
    data: {
      ...response.data,
      data: {
        ...profile,
        id: profile?.id || profile?._id,
        _id: profile?._id || profile?.id,
      },
    },
  };
};

export const updateMyProfile = async (profileData) => {
  const response = await axios.patch(`${API_URL}/profile`, profileData, withAuthHeaders());
  const profile = response?.data?.data || null;

  return {
    ...response,
    data: {
      ...response.data,
      data: {
        ...profile,
        id: profile?.id || profile?._id,
        _id: profile?._id || profile?.id,
      },
    },
  };
};

export const deleteMyProfile = async () => {
  return await axios.delete(`${API_URL}/profile`, withAuthHeaders());
};

export const validateAccessToken = async () => {
  return await axios.get(`${API_URL}/validate`, withAuthHeaders());
};

export const getOrganizerOnly = async () => {
  return await axios.get(`${API_URL}/organizer-only`, withAuthHeaders());
};

export const getAdminOnly = async () => {
  return await axios.get(`${API_URL}/admin-only`, withAuthHeaders());
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, withAuthHeaders());

  return {
    ...response,
    data: response?.data?.data || [],
  };
};

export const updateUser = async (id, userData) => {
  if (!userData.role) {
    throw new Error("Role is required");
  }

  return await axios.patch(
    `${API_URL}/users/${id}/role`,
    {
      role: userData.role,
    },
    withAuthHeaders()
  );
};
