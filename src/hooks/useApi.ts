import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api'
import { API_ENDPOINTS } from '../config/api'
import {
  User,
  Brand,
  Analysis,
  BrandAnalysisRequest,
  OptimizationMetricsRequest,
  QueryAnalysisRequest,
  SystemOverview,
  ApiUsageMetrics,
  ErrorLog,
  AdminActivityLog,
  UserImprovement,
  BotActivityData,
  ServerLogUpload,
  DashboardMetrics,
} from '../types/api'
import toast from 'react-hot-toast'

// Query keys
export const QUERY_KEYS = {
  health: ['health'],
  brands: ['brands'],
  brandHistory: (brandName: string) => ['brands', brandName, 'history'],
  analyses: ['analyses'],
  analysis: (id: string) => ['analyses', id],
  dashboardMetrics: ['dashboard', 'metrics'],
  
  // Admin
  adminUsers: (filters?: any) => ['admin', 'users', filters],
  adminSubscriptions: (filters?: any) => ['admin', 'subscriptions', filters],
  adminSystemOverview: ['admin', 'system', 'overview'],
  adminApiUsage: (days?: number, provider?: string) => ['admin', 'api-usage', days, provider],
  adminErrors: (filters?: any) => ['admin', 'errors', filters],
  adminActivityLogs: (filters?: any) => ['admin', 'activity-logs', filters],
  adminImprovements: (filters?: any) => ['admin', 'improvements', filters],
  
  // Log analysis
  logUploads: ['log-uploads'],
  logUploadStatus: (uploadId: string) => ['log-uploads', uploadId, 'status'],
  logAnalysis: (brandId: string, days?: number) => ['log-analysis', brandId, days],
  botActivity: (brandId: string, days?: number, platform?: string) => 
    ['bot-activity', brandId, days, platform],
} as const

// Health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: () => apiClient.get(API_ENDPOINTS.health),
    refetchInterval: 30000, // Check every 30 seconds
  })
}

// Brands
export const useBrands = () => {
  return useQuery({
    queryKey: QUERY_KEYS.brands,
    queryFn: () => apiClient.get<{ brands: Brand[]; total_count: number }>(API_ENDPOINTS.brands),
  })
}

export const useBrandHistory = (brandName: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.brandHistory(brandName),
    queryFn: () => apiClient.get(API_ENDPOINTS.brandHistory(brandName)),
    enabled: !!brandName,
  })
}

// Analysis mutations
export const useAnalyzeBrand = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: BrandAnalysisRequest) => 
      apiClient.post(API_ENDPOINTS.analyzeBrand, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.brands })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analyses })
      toast.success('Brand analysis completed successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Analysis failed'
      toast.error(message)
    },
  })
}

export const useOptimizationMetrics = () => {
  return useMutation({
    mutationFn: (data: OptimizationMetricsRequest) => 
      apiClient.post(API_ENDPOINTS.optimizationMetrics, data),
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Metrics calculation failed'
      toast.error(message)
    },
  })
}

export const useAnalyzeQueries = () => {
  return useMutation({
    mutationFn: (data: QueryAnalysisRequest) => 
      apiClient.post(API_ENDPOINTS.analyzeQueries, data),
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Query analysis failed'
      toast.error(message)
    },
  })
}

// Admin hooks
export const useAdminUsers = (filters?: any) => {
  return useQuery({
    queryKey: QUERY_KEYS.adminUsers(filters),
    queryFn: () => apiClient.get(API_ENDPOINTS.admin.users, { params: filters }),
  })
}

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId: string) => 
      apiClient.post(API_ENDPOINTS.admin.userToggleStatus(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User status updated successfully')
    },
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => 
      apiClient.put(API_ENDPOINTS.admin.userRole(userId), null, { params: { new_role: role } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User role updated successfully')
    },
  })
}

export const useAdminSubscriptions = (filters?: any) => {
  return useQuery({
    queryKey: QUERY_KEYS.adminSubscriptions(filters),
    queryFn: () => apiClient.get(API_ENDPOINTS.admin.subscriptions, { params: filters }),
  })
}

export const useSystemOverview = () => {
  return useQuery({
    queryKey: QUERY_KEYS.adminSystemOverview,
    queryFn: () => apiClient.get<SystemOverview>(API_ENDPOINTS.admin.metricsOverview),
    refetchInterval: 60000, // Refresh every minute
  })
}

export const useApiUsageMetrics = (days = 7, provider?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.adminApiUsage(days, provider),
    queryFn: () => apiClient.get<ApiUsageMetrics>(API_ENDPOINTS.admin.apiUsageMetrics, {
      params: { days, provider }
    }),
  })
}

export const useErrorLogs = (filters?: any) => {
  return useQuery({
    queryKey: QUERY_KEYS.adminErrors(filters),
    queryFn: () => apiClient.get<{ errors: ErrorLog[]; total: number }>(
      API_ENDPOINTS.admin.errors, 
      { params: filters }
    ),
  })
}

export const useResolveError = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ errorId, notes }: { errorId: string; notes: string }) => 
      apiClient.put(API_ENDPOINTS.admin.resolveError(errorId), null, { 
        params: { resolution_notes: notes } 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'errors'] })
      toast.success('Error marked as resolved')
    },
  })
}

export const useActivityLogs = (filters?: any) => {
  return useQuery({
    queryKey: QUERY_KEYS.adminActivityLogs(filters),
    queryFn: () => apiClient.get<{ logs: AdminActivityLog[]; count: number }>(
      API_ENDPOINTS.admin.activityLogs, 
      { params: filters }
    ),
  })
}

export const useUserImprovements = (filters?: any) => {
  return useQuery({
    queryKey: QUERY_KEYS.adminImprovements(filters),
    queryFn: () => apiClient.get<{ improvements: UserImprovement[]; total: number }>(
      API_ENDPOINTS.admin.improvements, 
      { params: filters }
    ),
  })
}

export const useUpdateImprovement = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      improvementId, 
      status, 
      priority, 
      adminNotes 
    }: { 
      improvementId: string
      status: string
      priority?: string
      adminNotes?: string 
    }) => 
      apiClient.put(API_ENDPOINTS.admin.improvement(improvementId), null, {
        params: { status, priority, admin_notes: adminNotes }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'improvements'] })
      toast.success('Improvement request updated')
    },
  })
}

// Log analysis hooks
export const useUploadServerLog = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ file, brandId, logFormat, timezone }: {
      file: File
      brandId: string
      logFormat: string
      timezone?: string
    }) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('brand_id', brandId)
      formData.append('log_format', logFormat)
      formData.append('timezone', timezone || 'UTC')
      
      return apiClient.upload(API_ENDPOINTS.logs.upload, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logUploads })
      toast.success('Log file uploaded successfully')
    },
  })
}

export const useLogUploadStatus = (uploadId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.logUploadStatus(uploadId),
    queryFn: () => apiClient.get<ServerLogUpload>(API_ENDPOINTS.logs.uploadStatus(uploadId)),
    enabled: !!uploadId,
    refetchInterval: (data) => {
      // Stop polling when upload is complete or failed
      const status = data?.status
      return status === 'processing' ? 2000 : false
    },
  })
}

export const useLogAnalysis = (brandId: string, days = 30) => {
  return useQuery({
    queryKey: QUERY_KEYS.logAnalysis(brandId, days),
    queryFn: () => apiClient.get(API_ENDPOINTS.logs.analysis(brandId), {
      params: { days }
    }),
    enabled: !!brandId,
  })
}

export const useBotActivity = (brandId: string, days = 7, platform?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.botActivity(brandId, days, platform),
    queryFn: () => apiClient.get<BotActivityData>(API_ENDPOINTS.logs.botActivity(brandId), {
      params: { days, platform }
    }),
    enabled: !!brandId,
  })
}

export const useAnalyzeSampleLog = () => {
  return useMutation({
    mutationFn: ({ logSample, logFormat }: { logSample: string; logFormat: string }) => 
      apiClient.post(API_ENDPOINTS.logs.analyzeSample, null, {
        params: { log_sample: logSample, log_format: logFormat }
      }),
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Log analysis failed'
      toast.error(message)
    },
  })
}

// Dashboard metrics (you might need to create this endpoint)
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardMetrics,
    queryFn: async () => {
      // This combines multiple API calls to create dashboard data
      const [brands, health] = await Promise.all([
        apiClient.get<{ brands: Brand[]; total_count: number }>(API_ENDPOINTS.brands),
        apiClient.get(API_ENDPOINTS.health),
      ])
      
      return {
        total_brands: brands.total_count,
        active_brands: brands.brands.filter(b => b.tracking_enabled).length,
        system_status: health.status,
        recent_brands: brands.brands.slice(0, 5),
      }
    },
    refetchInterval: 30000,
  })
}