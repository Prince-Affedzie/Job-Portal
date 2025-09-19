import { API } from '../apiConfig';
// Work submission and review
export const submitWorkForReview = (taskId, data) => API.post(`/api/submit_task_work/${taskId}`, data);
export const getMyWorkSubmissions = (taskId) => API.get(`/api/get_mysubmissions/${taskId}`);
export const deleteWorkSubmission = (submissionId) => API.delete(`/api/delete/submission/${submissionId}`);
export const clientGetTaskSubmissions = (taskId) => API.get(`/api/view_task_submissions/${taskId}`);
export const reviewSubmission = (submissionId, data) => API.put(`/api/review_task_submission/${submissionId}`, data);
export const getSignedUrl = (data) => API.post('/api/submissions/upload-url', data);
export const getPreviewUrl = (fileKey, selectedSubmission) => API.get(`/api/get_preview_url?fileKey=${encodeURIComponent(fileKey)}&selectedSubmission=${encodeURIComponent(selectedSubmission)}`);
export const sendFileToS3 = async (uploadURL, file, onProgress) => {
  await fetch(uploadURL, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
    onUploadProgress: onProgress
  });
};