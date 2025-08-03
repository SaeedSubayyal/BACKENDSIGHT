import React from 'react'
import { Bell, Search, User, LogOut, Settings } from 'lucide-react'
import { Menu } from '@headlessui/react'
import { useAuthStore } from '../stores/authStore'
import { useHealthCheck } from '../hooks/useApi'
import { cn } from '../lib/utils'

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore()
  const { data: health } = useHealthCheck()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-success-500'
      case 'degraded':
        return 'bg-warning-500'
      case 'unhealthy':
        return 'bg-error-500'
      default:
        return 'bg-secondary-400'
    }
  }

  return (
    <header className="bg-white border-b border-secondary-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search brands, analyses..."
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* System status */}
          <div className="flex items-center space-x-2">
            <div className={cn('w-2 h-2 rounded-full', getStatusColor(health?.status || 'unknown'))} />
            <span className="text-sm text-secondary-600">
              {health?.status || 'Unknown'}
            </span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-secondary-400 hover:text-secondary-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-50 transition-colors">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-secondary-900">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-secondary-500">
                  {user?.role === 'admin' ? 'Administrator' : 'Client'}
                </p>
              </div>
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={cn(
                      'flex items-center w-full px-4 py-2 text-sm text-left',
                      active ? 'bg-secondary-50 text-secondary-900' : 'text-secondary-700'
                    )}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={cn(
                      'flex items-center w-full px-4 py-2 text-sm text-left',
                      active ? 'bg-secondary-50 text-secondary-900' : 'text-secondary-700'
                    )}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                )}
              </Menu.Item>
              <div className="border-t border-secondary-200 my-1" />
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={cn(
                      'flex items-center w-full px-4 py-2 text-sm text-left',
                      active ? 'bg-secondary-50 text-error-600' : 'text-error-600'
                    )}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </header>
  )
}