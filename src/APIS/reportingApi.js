import { API } from '../apiConfig';
// Reporting and disputes
export const addReportingEvidence = (data) => API.post('/api/create/reporting/evidence', data);
export const raiseDispute = (reportForm) => API.post('/api/create_dispute', reportForm);