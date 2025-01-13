import axios from 'axios';

const API_URL = process.env.REACT_APP_URL;

export const instance = axios.create({
  baseURL: API_URL,
});
