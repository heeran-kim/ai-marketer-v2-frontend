// src/constants/api.ts

// Base API URL
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "https://localhost:8000/api";

// Health Check API Endpoint (for backend status verification)
export const HEALTH_CHECK_API = `${BASE_URL}/health/`;

// Users API Endpoints
export const USERS_API = {
    LOGIN:      `${BASE_URL}/users/login/`,
    LOGOUT:     `${BASE_URL}/users/logout/`,
    REGISTER:   `${BASE_URL}/users/register/`,
    ME:         `${BASE_URL}/users/me/`,
};

// Dashboard API Endpoints
export const DASHBOARD_API = {
    GET_ALL: `${BASE_URL}/dashboard/`,
};

// Settings API Endpoints
export const SETTINGS_API = {
    GENERAL:            `${BASE_URL}/businesses/me/`,
    GET_SOCIAL:         `${BASE_URL}/social/accounts/`,
    CONNECT_SOCIAL:     (provider: string) => `${BASE_URL}/social/connect/${provider}/`,
    DISCONNECT_SOCIAL:  (provider: string) => `${BASE_URL}/social/disconnect/${provider}/`,
};

// Posts API Endpoints
export const POSTS_API = {
    GET_ALL:    `${BASE_URL}/posts/`,
    CREATE:     `${BASE_URL}/posts/create/`,
    UPDATE:     (id: string) => `${BASE_URL}/posts/${id}/edit/`,
    DELETE:     (id: string) => `${BASE_URL}/posts/${id}/delete/`,
};

// Promotions API Endpoints
export const PROMOTIONS_API = {
    GET_ALL:    `${BASE_URL}/promotions/`,
    CREATE:     `${BASE_URL}/promotions/create/`,
    DELETE:     (id: string) => `${BASE_URL}/promotions/${id}/`,
};

// AI API Endpoints
export const AI_API = {
    IMG_ANALYSIS:       `${BASE_URL}/ai/images/analyse/`,
    CAPTION_GENERATE:   `${BASE_URL}/ai/captions/generate/`,
}
