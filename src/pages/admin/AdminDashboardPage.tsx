import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  DollarSign,
  Server,
  ArrowUpRight
} from 'lucide-react'
import { useSystemOverview, useApiUsageMetrics } from '../../hooks/useApi'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { formatCurrency, formatNumber, cn } from '../../lib/utils'

export const AdminDashboardPage: React.FC = () => {
  const { data: overview, isLoading: overviewLoading } = useSystemOverview()
  const { data: apiUsage, isLoading: usageLoading } = useApiUsageMetrics(7)

  if (overviewLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Users',
      value: overview?.users?.total || 0,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      href: '/admin/users',
    },
    {
      name: 'Active Subscriptions',
      value: overview?.subscriptions?.total_active || 0,
      change: '+8%',
      changeType: 'positive',
      icon: TrendingUp,
      href: '/admin/subscriptions',
    },
    {
      name: 'API Calls (7d)',
      value: apiUsage?.total_api_calls || 0,
      change: '+23%',
      changeType: 'positive',
      icon: Activity,
      href: '/admin/users',
    },
    {
      name: 'API Cost (7d)',
      value: formatCurrency(apiUsage?.total_cost || 0),
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      href: '/admin/users',
    },
    {
      name: 'System Errors (24h)',
      value: overview?.health?.errors_24h || 0,
      change: '-5%',
      changeType: 'negative',
      icon: AlertTriangle,
      href: '/admin/errors',
    },
    {
      name: 'System Status',
      value: overview?.health?.status || 'Unknown',
      change: 'Healthy',
      changeType: overview?.health?.status === 'healthy' ? 'positive' : 'negative',
      icon: Server,
      href: '/admin/errors',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Admin Dashboard</h1>
        <p className="text-secondary-600 mt-1">
          System overview and administrative controls
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="card hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">
                  {typeof stat.value === 'string' ? stat.value : formatNumber(stat.value)}
                </p>
                <div className="flex items-center mt-2">
                  <span className={cn(
                    'text-sm font-medium',
                    stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'
                  )}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-secondary-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-secondary-500 group-hover:text-primary-600 transition-colors">
              <span>View details</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Subscription breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Subscription Plans</h3>
          {overview?.subscriptions?.breakdown ? (
            <div className="space-y-4">
              {Object.entries(overview.subscriptions.breakdown).map(([plan, count]) => (
                <div key={plan} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary-500 rounded-full" />
                    <span className="text-sm font-medium text-secondary-700 capitalize">
                      {plan.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-secondary-900">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-secondary-500">
              No subscription data available
            </div>
          )}
        </div>

        {/* API usage by provider */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">API Usage by Provider</h3>
          {!usageLoading && apiUsage?.by_provider ? (
            <div className="space-y-4">
              {Object.entries(apiUsage.by_provider).map(([provider, data]) => (
                <div key={provider} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-success-500 rounded-full" />
                    <span className="text-sm font-medium text-secondary-700 capitalize">
                      {provider}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-secondary-900">
                      {formatNumber(data.calls)} calls
                    </div>
                    <div className="text-xs text-secondary-500">
                      {formatCurrency(data.cost)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : usageLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="text-center py-8 text-secondary-500">
              No API usage data available
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="flex items-center p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
          >
            <Users className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-secondary-900">Manage Users</p>
              <p className="text-xs text-secondary-500">View and edit users</p>
            </div>
          </Link>

          <Link
            to="/admin/subscriptions"
            className="flex items-center p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
          >
            <TrendingUp className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-secondary-900">Subscriptions</p>
              <p className="text-xs text-secondary-500">Billing & plans</p>
            </div>
          </Link>

          <Link
            to="/admin/errors"
            className="flex items-center p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
          >
            <AlertTriangle className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-secondary-900">Error Logs</p>
              <p className="text-xs text-secondary-500">System issues</p>
            </div>
          </Link>

          <Link
            to="/admin/activity"
            className="flex items-center p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
          >
            <Activity className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-secondary-900">Activity Logs</p>
              <p className="text-xs text-secondary-500">Admin actions</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}