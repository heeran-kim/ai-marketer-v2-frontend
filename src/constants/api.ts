// src/constants/api.ts

// Base API URL
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "https://localhost:8000/api";

// Health Check API Endpoint (for backend status verification)
export const HEALTH_CHECK_API = `${BASE_URL}/health/`;

// Users API Endpoints
export const USERS_API = {
  LOGIN: `${BASE_URL}/users/login/`,
  LOGOUT: `${BASE_URL}/users/logout/`,
  REGISTER: `${BASE_URL}/users/register/`,
  ME: `${BASE_URL}/users/me/`,
  DELETE_ACCOUNT: `${BASE_URL}/users/delete/`,

  //Added 2FA Endpoints
  QR_2FA: `${BASE_URL}/users/2fa-qr/`,
  CHECK_2FA: `${BASE_URL}/users/2fa-check/`,
  REMOVE_2FA: `${BASE_URL}/users/2fa-remove/`,

  FORGOT_PASSWORD: `${BASE_URL}/users/password/forgot/`,
  RESET_PASSWORD: `${BASE_URL}/users/password/reset/`,
};

// Dashboard API Endpoints
export const DASHBOARD_API = {
  GET_ALL: `${BASE_URL}/dashboard/`,
};

// Settings API Endpoints
export const SETTINGS_API = {
  GENERAL: `${BASE_URL}/businesses/me/`,
  GET_SOCIAL: `${BASE_URL}/social/accounts/`,
  FINALIZE_OAUTH: `${BASE_URL}/social/finalize_oauth/`,
  CONNECT_SOCIAL: (provider: string) =>
    `${BASE_URL}/social/connect/${provider}/`,
  DISCONNECT_SOCIAL: (provider: string) =>
    `${BASE_URL}/social/disconnect/${provider}/`,
  SALES: `${BASE_URL}/sales/`,
  SALES_REFRESH: `${BASE_URL}/sales/refresh/`,

  SQUARE: `${BASE_URL}/businesses/square/`,
  SQUARE_CONNECT: `${BASE_URL}/businesses/square/connect/`,
  SQUARE_CALLBACK: `${BASE_URL}/businesses/square/callback/`,
  SQUARE_DISCONNECT: `${BASE_URL}/businesses/square/disconnect/`,
  SQUARE_ITEMS: `${BASE_URL}/businesses/square/items/`,
  SQUARE_ITEM_UPDATE: (id: string) =>
    `${BASE_URL}/businesses/square/items/${id}/`,
};

// Posts API Endpoints
export const POSTS_API = {
  LIST: `${BASE_URL}/posts/`, // GET
  DETAIL: (id: string) => `${BASE_URL}/posts/${id}/`, // GET
  COMMENTS: (id: string) => `${BASE_URL}/posts/${id}/comments/`, // GET
  LIKE_COMMENTS: (id: string) => `${BASE_URL}/posts/${id}/likecomments/`, // GET
  REPLY_COMMENTS: (id: string, message: string) =>
    `${BASE_URL}/posts/${id}/replycomments/${message}`, // GET
  CREATE: `${BASE_URL}/posts/?create=true`, // GET, POST
  UPDATE: (id: string) => `${BASE_URL}/posts/${id}/`, // PATCH or PUT
  DELETE: (id: string) => `${BASE_URL}/posts/${id}/`, // DELETE
};

// Promotions API Endpoints
export const PROMOTIONS_API = {
  LIST: (type: "management" | "suggestions", showDismissed: boolean) =>
    `${BASE_URL}/promotions/?type=${type}${
      showDismissed ? "&show_dismissed=true" : ""
    }`,
  DETAIL: (id: string) => `${BASE_URL}/promotions/${id}/`,
  CREATE: `${BASE_URL}/promotions/`,
  UPDATE: (id: string) => `${BASE_URL}/promotions/${id}/`,
  DELETE: (id: string) => `${BASE_URL}/promotions/${id}/`,
  GENERATE: `${BASE_URL}/promotions/generate/`,
  DISMISS: (id: string) => `${BASE_URL}/promotions/${id}/dismiss/`,
};

// AI API Endpoints
export const AI_API = {
  IMG_ANALYSIS: `${BASE_URL}/ai/images/analyse/`,
  CAPTION_GENERATE: `${BASE_URL}/ai/captions/generate/`,
};
