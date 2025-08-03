import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Bot, 
  Building2, 
  FileText, 
  Home, 
  Settings, 
  Shield,
  Users,
  Activity,
  AlertTriangle,
  Database,
  TrendingUp,
  Lightbulb
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Brands', href: '/brands', icon: Building2 },
  { name: 'Analysis', href: '/analysis', icon: BarChart3 },
  { name: 'Log Analysis', href: '/log-analysis', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: Shield },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: TrendingUp },
  { name: 'Error Logs', href: '/admin/errors', icon: AlertTriangle },
  { name: 'Activity Logs', href: '/admin/activity', icon: Activity },
  { name: 'Improvements', href: '/admin/improvements', icon: Lightbulb },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="w-64 bg-white border-r border-secondary-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-secondary-900">AI Optimization</h1>
            <p className="text-xs text-secondary-500">Engine v2.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            )
          })}
        </div>

        {/* Admin section */}
        {isAdmin && (
          <div className="pt-6 mt-6 border-t border-secondary-200">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                Administration
              </h3>
            </div>
            <div className="space-y-1">
              {adminNavigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-secondary-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-900 truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-secondary-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}