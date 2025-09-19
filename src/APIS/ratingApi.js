import { API } from '../apiConfig';

export const giveRating =(Id,data)=>API.post(`/api/${Id}/rate`,data)