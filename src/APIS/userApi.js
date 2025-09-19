import { API } from '../apiConfig';
// User profile management
export const fetchUser = () => API.get("/api/user/view_profile");
export const completeProfile = (data) => API.put("/api/user/edit_profile", data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const modifyProfile = (formData) => API.put("/api/user/edit_profile", formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const uploadImage = (file) => {
  const form = new FormData();
  form.append("profileImage", file);
  return API.put("/api/user/image_profile", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};
export const addPortfolio = (data) => API.post("/api/user/upload_portfolio", data);
export const getEmployerProfile = () => API.get('/api/h1/v1/get_employer_profile');
export const authenticateChat = (targetUserId) => API.post("/api/user/authenticate", { targetUserId });