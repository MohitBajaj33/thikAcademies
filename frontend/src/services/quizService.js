import {API} from './api';

export const createQuizAPI = (quizData) => API.post('/quiz/create', quizData);
export const getQuizzesAPI = () => API.get('/quiz');
export const exportResults = (quizId) => API.get(`/quiz/export/${quizId}`, {
  responseType: 'blob', 
});
export const getQuizeIdAPI = (quizId) => API.get(`/quiz/${quizId}`)
export const updateQuizeIdAPI = ({id,data}) => API.post(`/quiz/${id}`,data)
export const rescheduleQuizeAPI = ({id, data})=> API.put( `quiz/${id}/reschedule`,data);
