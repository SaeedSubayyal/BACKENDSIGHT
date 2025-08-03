// API Types based on your backend OpenAPI schema

export interface StandardResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp?: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  company?: string
  role: 'client' | 'admin'
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login?: string
  subscription_plan?: string
}

export interface Brand {
  id: string
  name: string
  website_url?: string
  industry?: string
  tracking_enabled: boolean
  tracking_script_installed: boolean
  created_at: string
  last_analysis?: string
}

export interface Analysis {
  id: string
  brand_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  analysis_type: string
  data_source: string
  metrics?: OptimizationMetrics
  recommendations?: Recommendation[]
  total_bot_visits_analyzed: number
  citation_frequency: number
  processing_time?: number
  created_at: string
  started_at?: string
  completed_at?: string
}

export interface OptimizationMetrics {
  chunk_retrieval_frequency: number
  embedding_relevance_score: number
  attribution_rate: number
  ai_citation_count: number
  vector_index_presence_rate: number
  retrieval_confidence_score: number
  rrf_rank_contribution: number
  llm_answer_coverage: number
  ai_model_crawl_success_rate: number
  semantic_density_score: number
  zero_click_surface_presence: number
  machine_validated_authority: number
  overall_score?: number
  performance_grade?: string
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low'
  category: string
  title: string
  description: string
  action_items: string[]
  impact: string
  effort: string
  timeline: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: 'free' | 'bring_your_own_key' | 'platform_managed' | 'enterprise'
  status: string
  monthly_price: number
  yearly_price?: number
  billing_cycle: string
  monthly_analyses_limit?: number
  analyses_used_this_month: number
  user_seats: number
  brands_limit: number
  has_recommendations: boolean
  has_detailed_metrics: boolean
  has_export_features: boolean
  has_api_access: boolean
  current_period_end?: string
  started_at: string
}

export interface BotVisit {
  id: string
  brand_id: string
  bot_name: string
  platform: string
  user_agent: string
  timestamp: string
  ip_address?: string
  path: string
  status_code: number
  response_time?: number
  brand_mentioned: boolean
  content_type?: string
}

export interface ErrorLog {
  id: string
  error_type: string
  error_message: string
  severity: string
  category?: string
  user_id?: string
  endpoint?: string
  is_resolved: boolean
  created_at: string
}

export interface AdminActivityLog {
  id: string
  admin_email: string
  action: string
  resource_type: string
  resource_id?: string
  notes?: string
  created_at: string
}

export interface UserImprovement {
  id: string
  title: string
  description: string
  category?: string
  status: string
  priority?: string
  upvotes: number
  downvotes: number
  user_email: string
  created_at: string
  reviewed_by?: string
}

export interface ServerLogUpload {
  id: string
  filename: string
  file_size_mb: number
  file_format: string
  status: string
  uploaded_at: string
  total_requests?: number
  bot_requests?: number
  unique_bots?: number
  processing_time?: number
  error?: string
}

// Request types
export interface BrandAnalysisRequest {
  brand_name: string
  website_url?: string
  product_categories?: string[]
  content_sample?: string
  competitor_names?: string[]
}

export interface OptimizationMetricsRequest {
  brand_name: string
  content_sample?: string
  website_url?: string
}

export interface QueryAnalysisRequest {
  brand_name: string
  product_categories: string[]
}

export interface LoginRequest {
  email?: string
  password?: string
  oauth_token?: string
}

export interface RegisterRequest {
  email: string
  password?: string
  full_name?: string
  company?: string
  oauth_token?: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  email: string
  token: string
  new_password: string
}

// Dashboard data types
export interface DashboardMetrics {
  total_analyses: number
  active_brands: number
  citation_rate: number
  bot_visits_today: number
  recent_analyses: Analysis[]
  platform_breakdown: Record<string, number>
  trending_metrics: Array<{
    name: string
    value: number
    change: number
  }>
}

export interface SystemOverview {
  users: {
    total: number
    active: number
    admins: number
  }
  subscriptions: {
    total_active: number
    breakdown: Record<string, number>
  }
  usage: {
    analyses_30d: number
    api_calls_30d: number
    api_cost_30d: number
  }
  health: {
    errors_24h: number
    status: string
  }
}

export interface ApiUsageMetrics {
  period_days: number
  total_api_calls: number
  total_tokens: number
  total_cost: number
  by_provider: Record<string, {
    calls: number
    tokens_input: number
    tokens_output: number
    cost: number
    models: Record<string, {
      calls: number
      tokens: number
      cost: number
    }>
  }>
  daily_average: {
    calls: number
    cost: number
  }
}

export interface BotActivityData {
  period_days: number
  total_bot_visits: number
  platform_breakdown: Record<string, {
    total_visits: number
    brand_mentions: number
    citation_rate: number
    unique_paths: number
    success_rate: number
  }>
  hourly_distribution: Record<number, number>
  top_paths: Array<{
    path: string
    visits: number
    brand_mentions: number
    citation_rate: number
  }>
}