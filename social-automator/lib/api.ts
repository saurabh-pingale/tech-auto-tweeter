import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});