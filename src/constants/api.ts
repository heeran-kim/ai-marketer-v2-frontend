// src/constants/api.ts

// Health Check API Endpoint (for backend status verification)
export const HEALTH_CHECK_API = "/health/";

// Users API Endpoints
export const USERS_API = {
  LOGIN: "/users/login/",
  LOGOUT: "/users/logout/",
  REGISTER: "/users/register/",
  ME: "/users/me/",

  //Added 2FA Endpoints
  QR_2FA: "/users/2fa-qr/",
  CHECK_2FA: "/users/2fa-check/",
  REMOVE_2FA: "/users/2fa-remove/",
};

// Dashboard API Endpoints
export const DASHBOARD_API = {
  GET_ALL: "/dashboard/",
};

// Settings API Endpoints
export const SETTINGS_API = {
  GENERAL: "/businesses/me/",
  GET_SOCIAL: "/social/accounts/",
  CONNECT_SOCIAL: (provider: string) => `/social/connect/${provider}/`,
  DISCONNECT_SOCIAL: (provider: string) => `/social/disconnect/${provider}/`,
  SALES: "/sales/",
};

// Posts API Endpoints
export const POSTS_API = {
  LIST: "/posts/", // GET
  DETAIL: (id: string) => `/posts/${id}/`, // GET
  CREATE: "/posts/?create=true", // POST
  UPDATE: (id: string) => `/posts/${id}/`, // PATCH or PUT
  DELETE: (id: string) => `/posts/${id}/`, // DELETE
};

// Promotions API Endpoints
export const PROMOTIONS_API = {
  LIST: "/promotions/",
  DETAIL: (id: string) => `/promotions/${id}/`,
  CREATE: "/promotions/create/",
  DELETE: (id: string) => `/promotions/${id}/`,
};

// AI API Endpoints
export const AI_API = {
  IMG_ANALYSIS: "/ai/images/analyse/",
  CAPTION_GENERATE: "/ai/captions/generate/",
};
