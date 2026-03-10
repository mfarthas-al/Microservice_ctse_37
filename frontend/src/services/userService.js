import axios from "axios";

const API_URL = "http://localhost:5003/api/users";

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (credentials) => {
  return await axios.post(`${API_URL}/login`, credentials);
};

export const getUsers = async () => {
  return await axios.get(API_URL);
};

export const updateUser = async (id, userData) => {
  return await axios.put(`${API_URL}/${id}`, userData);
};
