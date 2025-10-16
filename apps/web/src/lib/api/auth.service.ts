import axios, { AxiosError } from 'axios';
import { RegisterData, LoginData } from './auth.types';

const API_URL = 'http://localhost:3000/auth';

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Registration API error:', axiosError.response?.data || axiosError.message);
    throw axiosError.response?.data || error;
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || error;
  }
};