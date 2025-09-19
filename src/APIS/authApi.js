import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
  timeout: 10000,
});

// Authentication APIs
export const signUp = (data) => API.post("/api/user/signup", data);
export const loginUser = (data) => API.post("/api/user/login", data);
export const logoutUser = () => API.post('/api/user/logout');
export const requestPasswordReset = (email) => API.post("/api/user/request-password-reset", { email });
export const resetPassword = (password) => API.post('/api/user/reset-password', { password });
export const adminLogin = (data) => API.post(`/api/admin/login`, data);
export const employerSignUp = (data) => API.post('/api/h1/v1/employer_sign_up', data, {
  headers: { "Content-Type": "multipart/form-data" }
});