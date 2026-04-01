import axios from "axios";
import { authApiUrl, requireServiceUrl } from "../config/apiConfig";
import { getAuthHeaders } from "./authStorage";

// IMPORTANT: Auth service must be configured for login/profile. Do not throw at import-time;
// allow the app to render the login screen and surface a clear error on submit.
const getBaseUrl = () => requireServiceUrl("Auth service", authApiUrl);

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
  const API_URL = getBaseUrl();
  const response = await axios.post(`${API_URL}/register`, userData);
  return normalizeAuthResponse(response.data);
};

export const loginUser = async (credentials) => {
  const API_URL = getBaseUrl();
  const response = await axios.post(`${API_URL}/login`, credentials);
  const normalized = normalizeAuthResponse(response.data);

  // Defensive: if API_URL is misconfigured in production (e.g., points to the Amplify SPA),
  // axios may receive HTML with 200 and we'd "log in" with empty tokens. Require a real token.
  if (!normalized?.accessToken || !normalized?.user?.id) {
    throw new Error(
      "Login did not return tokens. Check auth service URL env configuration."
    );
  }

  return normalized;
};

export const refreshAccessToken = async (refreshToken) => {
  const API_URL = getBaseUrl();
  const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
  return {
    accessToken: response?.data?.data?.accessToken || "",
    refreshToken: response?.data?.data?.refreshToken || "",
  };
};

export const logoutUser = async (refreshToken) => {
  const API_URL = getBaseUrl();
  return await axios.post(`${API_URL}/logout`, { refreshToken });
};

export const getMyProfile = async () => {
  const API_URL = getBaseUrl();
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
  const API_URL = getBaseUrl();
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
  const API_URL = getBaseUrl();
  return await axios.delete(`${API_URL}/profile`, withAuthHeaders());
};

export const validateAccessToken = async () => {
  const API_URL = getBaseUrl();
  return await axios.get(`${API_URL}/validate`, withAuthHeaders());
};

export const getOrganizerOnly = async () => {
  const API_URL = getBaseUrl();
  return await axios.get(`${API_URL}/organizer-only`, withAuthHeaders());
};

export const getAdminOnly = async () => {
  const API_URL = getBaseUrl();
  return await axios.get(`${API_URL}/admin-only`, withAuthHeaders());
};

export const getUsers = async () => {
  const API_URL = getBaseUrl();
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

  const API_URL = getBaseUrl();
  return await axios.patch(
    `${API_URL}/users/${id}/role`,
    {
      role: userData.role,
    },
    withAuthHeaders()
  );
};
