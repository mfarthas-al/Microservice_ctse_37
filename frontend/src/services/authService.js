export const AUTH_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const CURRENT_USER_KEY = "currentUser";

export const saveAuthSession = (user, accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (user) {
    const normalizedUser = {
      ...user,
      id: user.id || user._id,
      _id: user._id || user.id,
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalizedUser));
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getAccessToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
};

export const setAccessToken = (accessToken) => {
  if (accessToken) {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  }
};

export const setRefreshToken = (refreshToken) => {
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const getAuthHeaders = () => {
  const token = getAccessToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getStoredUser = () => {
  const raw = localStorage.getItem(CURRENT_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      id: parsed.id || parsed._id,
      _id: parsed._id || parsed.id,
    };
  } catch (_error) {
    return null;
  }
};
