import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  ExternalLink, 
  Activity, 
  BarChart3, 
  Bot,
  TrendingUp,
  Calendar,
  Settings
} from 'lucide-react'
import { useBrandHistory, useBotActivity } from '../hooks/useApi'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { formatRelativeTime, formatPercentage, cn } from '../lib/utils'

export const BrandDetailPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const [timeRange, setTimeRange] = React.useState(7)

  const { data: historyData, isLoading: historyLoading } = useBrandHistory(brandId || '')
  const { data: botActivity, isLoading: activityLoading } = useBotActivity(
    brandId || '', 
    timeRange
  )

  if (historyLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!historyData) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-500">Brand not found</p>
        <Link to="/brands" className="btn-primary mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Brands
        </Link>
      </div>
    )
  }

  const brand = historyData
  const analyses = historyData.history || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/brands" className="p-2 text-secondary-400 hover:text-secondary-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">{brand.brand_name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              {brand.website_url && (
                <a
                  href={brand.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-600 hover:text-primary-500"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  {new URL(brand.website_url).hostname}
                </a>
              )}
              <span className="text-secondary-500">•</span>
              <span className="text-secondary-500">{analyses.length} analyses</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="input w-32"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <Link to={`/analysis?brand=${brandId}`} className="btn-primary">
            <BarChart3 className="w-4 h-4 mr-2" />
            New Analysis
          </Link>
        </div>
      </div>

      {/* Bot activity overview */}
      {botActivity && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Bot Visits</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">
                  {botActivity.total_bot_visits.toLocaleString()}
                </p>
              </div>
              <Bot className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Platforms</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">
                  {Object.keys(botActivity.platform_breakdown).length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-success-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Avg Citation Rate</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">
                  {formatPercentage(
                    Object.values(botActivity.platform_breakdown)
                      .reduce((acc, platform) => acc + platform.citation_rate, 0) /
                    Object.keys(botActivity.platform_breakdown).length || 0
                  )}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-warning-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Unique Paths</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">
                  {Object.values(botActivity.platform_breakdown)
                    .reduce((acc, platform) => acc + platform.unique_paths, 0)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-secondary-600" />
            </div>
          </div>
        </div>
      )}

      {/* Platform breakdown */}
      {botActivity && Object.keys(botActivity.platform_breakdown).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Platform Activity</h3>
          <div className="space-y-4">
            {Object.entries(botActivity.platform_breakdown).map(([platform, data]) => (
              <div key={platform} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900 capitalize">{platform}</h4>
                    <p className="text-sm text-secondary-500">
                      {data.total_visits} visits • {data.unique_paths} unique paths
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-secondary-900">
                    {formatPercentage(data.citation_rate)}
                  </div>
                  <div className="text-sm text-secondary-500">Citation rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis history */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">Analysis History</h3>
          <Link to={`/analysis?brand=${brandId}`} className="btn-outline">
            Run New Analysis
          </Link>
        </div>

        {analyses.length > 0 ? (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    analysis.status === 'completed' ? 'bg-success-100' :
                    analysis.status === 'failed' ? 'bg-error-100' :
                    'bg-warning-100'
                  )}>
                    <BarChart3 className={cn(
                      'w-5 h-5',
                      analysis.status === 'completed' ? 'text-success-600' :
                      analysis.status === 'failed' ? 'text-error-600' :
                      'text-warning-600'
                    )} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-secondary-900">
                        {analysis.analysis_type || 'Analysis'}
                      </h4>
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        analysis.status === 'completed' ? 'text-success-800 bg-success-100' :
                        analysis.status === 'failed' ? 'text-error-800 bg-error-100' :
                        'text-warning-800 bg-warning-100'
                      )}>
                        {analysis.status}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-500">
                      {formatRelativeTime(analysis.date)} • 
                      {analysis.processing_time && ` ${analysis.processing_time}s processing time`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {analysis.overall_score && (
                    <div className="text-lg font-semibold text-secondary-900">
                      {Math.round(analysis.overall_score * 100)}%
                    </div>
                  )}
                  <Link
                    to={`/analysis/result/${analysis.id}`}
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    View Results
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-500 mb-4">No analyses yet</p>
            <Link to={`/analysis?brand=${brandId}`} className="btn-primary">
              Run First Analysis
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}