import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
});

export const getQuizzes = async () => {
    const { data } = await api.get('/quizzes');
    return data;
};

export const getQuiz = async (id: string) => {
    const { data } = await api.get(`/quizzes/${id}`);
    return data;
};

export const createQuiz = async (quizData: any) => {
    const { data } = await api.post('/quizzes', quizData);
    return data;
};

export const deleteQuiz = async (id: string) => {
    await api.delete(`/quizzes/${id}`);
};