import React from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  User
} from 'lucide-react'
import { Menu } from '@headlessui/react'
import { useAdminUsers, useToggleUserStatus, useUpdateUserRole } from '../../hooks/useApi'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { formatRelativeTime, cn } from '../../lib/utils'
import { User as UserType } from '../../types/api'

export const AdminUsersPage: React.FC = () => {
  const [search, setSearch] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState<string>('')
  const [statusFilter, setStatusFilter] = React.useState<string>('')

  const { data: usersData, isLoading } = useAdminUsers({
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
  })

  const toggleUserStatusMutation = useToggleUserStatus()
  const updateUserRoleMutation = useUpdateUserRole()

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatusMutation.mutateAsync(userId)
    } catch (error) {
      // Error handled in mutation
    }
  }

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await updateUserRoleMutation.mutateAsync({ userId, role })
    } catch (error) {
      // Error handled in mutation
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const users = usersData?.users || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">User Management</h1>
          <p className="text-secondary-600 mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-secondary-500">
            {usersData?.total || 0} total users
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10 w-64"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input w-32"
            >
              <option value="">All Roles</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-32"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {users.map((user: UserType & { subscription_plan?: string }) => (
                <tr key={user.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {user.full_name?.charAt(0) || user.email.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary-900">
                          {user.full_name || 'No name'}
                        </div>
                        <div className="text-sm text-secondary-500">{user.email}</div>
                        {user.company && (
                          <div className="text-xs text-secondary-400">{user.company}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      user.role === 'admin'
                        ? 'text-primary-800 bg-primary-100'
                        : 'text-secondary-800 bg-secondary-100'
                    )}>
                      {user.role === 'admin' ? (
                        <>
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 mr-1" />
                          Client
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      user.is_active
                        ? 'text-success-800 bg-success-100'
                        : 'text-error-800 bg-error-100'
                    )}>
                      {user.is_active ? (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    <span className="capitalize">
                      {user.subscription_plan?.replace('_', ' ') || 'None'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {user.last_login ? formatRelativeTime(user.last_login) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="p-2 text-secondary-400 hover:text-secondary-600">
                        <MoreVertical className="w-4 h-4" />
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-10">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={cn(
                                'flex items-center w-full px-4 py-2 text-sm text-left',
                                active ? 'bg-secondary-50' : '',
                                user.is_active ? 'text-error-600' : 'text-success-600'
                              )}
                            >
                              {user.is_active ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2" />
                                  Disable User
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Enable User
                                </>
                              )}
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleUpdateRole(
                                user.id, 
                                user.role === 'admin' ? 'client' : 'admin'
                              )}
                              className={cn(
                                'flex items-center w-full px-4 py-2 text-sm text-left',
                                active ? 'bg-secondary-50 text-secondary-900' : 'text-secondary-700'
                              )}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}