import {API} from './api';
export const userProfileAPI = () => API.get('/auth/profile');
export const registerAPI = (data) => API.post('/auth/register', data);
export const loginAPI = (data) => API.post('/auth/login', data);
export const getUser = () => API.get('/auth/me');
export const logOutUserAPI = () => API.post('/auth/logout')
export const getAllUserAPI = () => API.get('/auth/userall')
export const adminexportAPI = () => API.get('/results/admin/export')
export const getAllResult = () => API.get('/results/admin'); 
export const getUserResultAPI = () => API.get('/results/my');

