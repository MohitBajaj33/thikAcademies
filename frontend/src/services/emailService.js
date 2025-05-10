import {API} from './api';

export const emailSenderApi = (url, payload) => API.post(url, payload);
export const verifyEmailAPI = (data)=> API.post('/email/verify-otp',data);
export const emailSendOneAPI = (data) => API.post('/email/send-otp',data);