// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  version: import.meta.env.VITE_API_VERSION || 'v2',
  timeout: 30000,
  retries: 3,
}

export const API_ENDPOINTS = {
  // Auth
  login: '/login',
  register: '/register',
  passwordReset: '/password-reset',
  passwordResetConfirm: '/password-reset/confirm',
  
  // Health
  health: '/health',
  
  // Core analysis
  analyzeBrand: '/analyze-brand',
  optimizationMetrics: '/optimization-metrics',
  analyzeQueries: '/analyze-queries',
  
  // Brands
  brands: '/brands',
  brandHistory: (brandName: string) => `/brands/${brandName}/history`,
  
  // Admin endpoints
  admin: {
    users: '/api/v2/admin/users',
    userToggleStatus: (userId: string) => `/api/v2/admin/users/${userId}/toggle-status`,
    userRole: (userId: string) => `/api/v2/admin/users/${userId}/role`,
    subscriptions: '/api/v2/admin/subscriptions',
    subscription: (subscriptionId: string) => `/api/v2/admin/subscriptions/${subscriptionId}`,
    metricsOverview: '/api/v2/admin/metrics/overview',
    apiUsageMetrics: '/api/v2/admin/metrics/api-usage',
    errors: '/api/v2/admin/errors',
    resolveError: (errorId: string) => `/api/v2/admin/errors/${errorId}/resolve`,
    activityLogs: '/api/v2/admin/activity-logs',
    improvements: '/api/v2/admin/improvements',
    improvement: (improvementId: string) => `/api/v2/admin/improvements/${improvementId}`,
  },
  
  // Log analysis
  logs: {
    upload: '/api/v2/logs/upload',
    uploadStatus: (uploadId: string) => `/api/v2/logs/upload/${uploadId}/status`,
    analysis: (brandId: string) => `/api/v2/logs/analysis/${brandId}`,
    botActivity: (brandId: string) => `/api/v2/logs/bot-activity/${brandId}`,
    analyzeSample: '/api/v2/logs/analyze-sample',
  },
} as const

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.baseURL}${endpoint}`
}

export const getAuthHeaders = (token?: string) => {
  const authToken = token || localStorage.getItem('auth_token')
  return authToken ? { Authorization: `Bearer ${authToken}` } : {}
}