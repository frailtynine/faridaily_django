import axios from "axios";
import { ChannelResponse, LoginRequest, LoginResponse } from "./interface";


const BASE_URL: string = import.meta.env.VITE_BASE_URL || '';

const api = axios.create({baseURL: `${BASE_URL}/api/`})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)

// refresh token mechanics 
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${BASE_URL}/api/token/refresh`, { refresh: refreshToken });
        const { access: token } = response.data;
        
        localStorage.setItem('token', token);
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    }

    return Promise.reject(error);
  }
)

export async function fetchTgData(): Promise<ChannelResponse | undefined> {
  try {
    const response = await api.get(`tg/get_data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching telegram data:", error);
  }
}

export async function fetchModels(endpoint: string): Promise<any> {
  const response = await api.get<any>(endpoint);
  return response.data;
}

export async function postModel(endpoint: string, payload: any) {
  try {
    const response = await api.post<any>(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error('Error posting model:', error);
    throw error;
  }
}

export async function updateModel(endpoint: string, id: number, payload: any) {
  try {
    const response = await api.put<any>(`${endpoint}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error posting model:', error);
    throw error;
  }
}

export async function deleteModel(endpoint: string, id: number) {
  try {
    await api.delete<any>(`${endpoint}/${id}`);
  } catch (error) {
    console.error('Error posting model:', error);
    throw error;
  }
}

export async function fetchLogin(loginRequest: LoginRequest): Promise<any> {
    const response = await api.post<LoginResponse>(`token/pair`, loginRequest)
    return response.data
}


export async function verifyToken(): Promise<any> {
  const response = await api.get<any>('auth/verify');
  return response.status
}

export async function refreshTgData(): Promise<any> {
  const response = await api.get<any>('tg/refresh_data');
  return response.status
}