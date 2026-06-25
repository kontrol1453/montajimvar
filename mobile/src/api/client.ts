import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://montajimvar.xyz/api';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle 401 and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;
            try {
              const newToken = await this.refreshToken();
              this.isRefreshing = false;
              this.onRefreshSuccess(newToken);
              return this.client(originalRequest);
            } catch (refreshError) {
              this.isRefreshing = false;
              this.onRefreshFailure();
              await this.clearAuthAndRedirect();
              return Promise.reject(refreshError);
            }
          }

          // Wait for token refresh
          return new Promise((resolve, reject) => {
            this.addRefreshSubscriber((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(this.client(originalRequest));
            });
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', newRefreshToken);
    
    return accessToken;
  }

  private addRefreshSubscriber(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  private onRefreshSuccess(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private onRefreshFailure(): void {
    this.refreshSubscribers.forEach((callback) => callback(''));
    this.refreshSubscribers = [];
  }

  private async clearAuthAndRedirect(): Promise<void> {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    // Navigation logic will be handled by auth store
  }

  // Public methods
  async get<T>(url: string, params?: object): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: object): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: object): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  // Auth specific methods
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    return user;
  }

  async register(data: { name: string; email: string; password: string; role?: string }) {
    const response = await this.client.post('/auth/register', data);
    const { accessToken, refreshToken, user } = response.data;
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    return user;
  }

  async googleLogin(idToken: string) {
    const response = await this.client.post('/auth/google', { idToken });
    const { accessToken, refreshToken, user } = response.data;
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    return user;
  }

  async logout() {
    await this.client.post('/auth/logout');
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }

  // API endpoints
  async getCompanies(params?: { page?: number; limit?: number; category?: string; city?: string }) {
    return this.get('/companies', params);
  }

  async getCompany(id: string) {
    return this.get(`/companies/${id}`);
  }

  async getFavorites() {
    return this.get('/favorites');
  }

  async addFavorite(companyId: string) {
    return this.post('/favorites', { companyId });
  }

  async removeFavorite(companyId: string) {
    return this.delete(`/favorites/${companyId}`);
  }

  async getMessages() {
    return this.get('/messages');
  }

  async getConversation(userId: string) {
    return this.get(`/messages/${userId}`);
  }

  async sendMessage(userId: string, content: string) {
    return this.post('/messages', { receiverId: userId, content });
  }

  async getProfile() {
    return this.get('/user/profile');
  }

  async updateProfile(data: Partial<{ name: string; phone: string; city: string }>) {
    return this.put('/user/profile', data);
  }

  async getNotifications() {
    return this.get('/notifications');
  }
}

export const api = new ApiClient();
export default api;