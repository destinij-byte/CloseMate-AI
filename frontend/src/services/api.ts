import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export type SubscriptionStatus = 'free' | 'paid' | 'trialing';

export interface AuthResponse {
  token: string;
  user: { id: number; email: string; subscriptionStatus?: string; trialEndsAt?: string | null };
}

export interface UsageResponse {
  subscriptionStatus: SubscriptionStatus;
  dailyUsage: number;
  dailyLimit: number | 'unlimited';
  trialEndsAt: string | null;
  daysRemaining: number;
}

export const api = {
  async signup(email: string, password: string) {
    const { data } = await apiClient.post<AuthResponse>('/auth/signup', { email, password });
    return data;
  },

  async login(email: string, password: string) {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  async objectionHandle(objection: string, context?: string) {
    const { data } = await apiClient.post<{ script: string }>('/ai/objection-handle', { objection, context });
    return data;
  },

  async generateScript(scenario: string, product: string) {
    const { data } = await apiClient.post<{ script: string }>('/ai/generate-script', { scenario, product });
    return data;
  },

  async suggestResponse(leadMessage: string, lastInteraction?: string) {
    const { data } = await apiClient.post<{ suggestion: string }>('/ai/suggest-response', { leadMessage, lastInteraction });
    return data;
  },

  async getUsage() {
    const { data } = await apiClient.get<UsageResponse>('/user/usage');
    return data;
  },

  async createCheckoutSession() {
    const { data } = await apiClient.post<{ id: string; url: string }>('/subscription/create-checkout-session');
    return data;
  },
};