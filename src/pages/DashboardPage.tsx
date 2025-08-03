import React from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  Bot, 
  Building2, 
  BarChart3, 
  Plus,
  ArrowUpRight,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useDashboardMetrics, useHealthCheck } from '../hooks/useApi'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { formatRelativeTime, getStatusColor, cn } from '../lib/utils'

export const DashboardPage: React.FC = () => {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics()
  const { data: health } = useHealthCheck()

  const quickStats = [
    {
      name: 'Total Brands',
      value: metrics?.total_brands || 0,
      icon: Building2,
      color: 'text-primary-600 bg-primary-50',
      href: '/brands',
    },
    {
      name: 'Active Tracking',
      value: metrics?.active_brands || 0,
      icon: Bot,
      color: 'text-success-600 bg-success-50',
      href: '/brands',
    },
    {
      name: 'System Status',
      value: health?.status || 'Unknown',
      icon: health?.status === 'healthy' ? CheckCircle : AlertCircle,
      color: health?.status === 'healthy' 
        ? 'text-success-600 bg-success-50' 
        : 'text-warning-600 bg-warning-50',
      href: '/admin',
    },
    {
      name: 'Recent Analysis',
      value: metrics?.recent_brands?.length || 0,
      icon: BarChart3,
      color: 'text-secondary-600 bg-secondary-50',
      href: '/analysis',
    },
  ]

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600 mt-1">
            Monitor your AI optimization performance and bot activity
          </p>
        </div>
        <Link to="/analysis" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Analysis
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="card hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">
                  {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                </p>
              </div>
              <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-secondary-500 group-hover:text-primary-600 transition-colors">
              <span>View details</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent brands */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Recent Brands</h3>
            <Link to="/brands" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          
          {metrics?.recent_brands?.length ? (
            <div className="space-y-4">
              {metrics.recent_brands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{brand.name}</p>
                      <p className="text-sm text-secondary-500">
                        {brand.industry || 'No industry set'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      brand.tracking_enabled 
                        ? 'text-success-700 bg-success-100' 
                        : 'text-secondary-700 bg-secondary-100'
                    )}>
                      {brand.tracking_enabled ? 'Active' : 'Inactive'}
                    </div>
                    <p className="text-xs text-secondary-500 mt-1">
                      {formatRelativeTime(brand.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
              <p className="text-secondary-500">No brands yet</p>
              <Link to="/brands" className="btn-primary mt-4">
                Add your first brand
              </Link>
            </div>
          )}
        </div>

        {/* System health */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">System Health</h3>
            <div className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              getStatusColor(health?.status || 'unknown')
            )}>
              {health?.status || 'Unknown'}
            </div>
          </div>

          {health?.services && (
            <div className="space-y-3">
              {Object.entries(health.services).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-700 capitalize">
                    {service}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      status ? 'bg-success-500' : 'bg-error-500'
                    )} />
                    <span className="text-sm text-secondary-600">
                      {status ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {health?.response_time && (
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Response Time</span>
                <span className="font-medium text-secondary-900">{health.response_time}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/analysis"
            className="flex items-center p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <BarChart3 className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-secondary-900">Run Analysis</p>
              <p className="text-sm text-secondary-500">Analyze brand optimization</p>
            </div>
          </Link>

          <Link
            to="/brands"
            className="flex items-center p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <Building2 className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-secondary-900">Manage Brands</p>
              <p className="text-sm text-secondary-500">Add or configure brands</p>
            </div>
          </Link>

          <Link
            to="/log-analysis"
            className="flex items-center p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <Activity className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-secondary-900">Log Analysis</p>
              <p className="text-sm text-secondary-500">Upload server logs</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}