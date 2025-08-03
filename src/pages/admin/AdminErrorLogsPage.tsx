import React from 'react'
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { useErrorLogs, useResolveError } from '../../hooks/useApi'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { formatRelativeTime, cn } from '../../lib/utils'
import { ErrorLog } from '../../types/api'

export const AdminErrorLogsPage: React.FC = () => {
  const [search, setSearch] = React.useState('')
  const [severityFilter, setSeverityFilter] = React.useState('')
  const [unresolvedOnly, setUnresolvedOnly] = React.useState(false)
  const [selectedError, setSelectedError] = React.useState<ErrorLog | null>(null)
  const [resolutionNotes, setResolutionNotes] = React.useState('')

  const { data: errorData, isLoading } = useErrorLogs({
    severity: severityFilter || undefined,
    unresolved_only: unresolvedOnly,
  })

  const resolveErrorMutation = useResolveError()

  const handleResolveError = async (errorId: string) => {
    if (!resolutionNotes.trim()) {
      return
    }

    try {
      await resolveErrorMutation.mutateAsync({ errorId, notes: resolutionNotes })
      setSelectedError(null)
      setResolutionNotes('')
    } catch (error) {
      // Error handled in mutation
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-error-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-error-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning-500" />
      case 'info':
        return <Clock className="w-4 h-4 text-primary-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-secondary-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-error-800 bg-error-100 border-error-200'
      case 'error':
        return 'text-error-700 bg-error-50 border-error-200'
      case 'warning':
        return 'text-warning-700 bg-warning-50 border-warning-200'
      case 'info':
        return 'text-primary-700 bg-primary-50 border-primary-200'
      default:
        return 'text-secondary-700 bg-secondary-50 border-secondary-200'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const errors = errorData?.errors || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Error Logs</h1>
          <p className="text-secondary-600 mt-1">
            Monitor and resolve system errors
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-secondary-500">
            {errorData?.total || 0} total errors
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
                placeholder="Search errors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10 w-64"
              />
            </div>
            
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="input w-32"
            >
              <option value="">All Severity</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={unresolvedOnly}
                onChange={(e) => setUnresolvedOnly(e.target.checked)}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-secondary-700">Unresolved only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Error logs table */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Error
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {errors.map((error: ErrorLog) => (
                <tr key={error.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        {error.error_type}
                      </div>
                      <div className="text-sm text-secondary-500 max-w-md truncate">
                        {error.error_message}
                      </div>
                      {error.endpoint && (
                        <div className="text-xs text-secondary-400 mt-1">
                          {error.endpoint}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      getSeverityColor(error.severity)
                    )}>
                      {getSeverityIcon(error.severity)}
                      <span className="ml-1 capitalize">{error.severity}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {error.category || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      error.is_resolved
                        ? 'text-success-800 bg-success-100'
                        : 'text-warning-800 bg-warning-100'
                    )}>
                      {error.is_resolved ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Open
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {formatRelativeTime(error.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedError(error)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </button>
                      {!error.is_resolved && (
                        <>
                          <span className="text-secondary-300">|</span>
                          <button
                            onClick={() => {
                              setSelectedError(error)
                              setResolutionNotes('')
                            }}
                            className="text-success-600 hover:text-success-900"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {errors.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-success-300 mx-auto mb-4" />
            <p className="text-secondary-500">No errors found</p>
          </div>
        )}
      </div>

      {/* Error detail modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-secondary-900">Error Details</h3>
                <button
                  onClick={() => setSelectedError(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary-700">Error Type</label>
                <p className="text-secondary-900">{selectedError.error_type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-secondary-700">Message</label>
                <p className="text-secondary-900">{selectedError.error_message}</p>
              </div>
              
              {selectedError.endpoint && (
                <div>
                  <label className="text-sm font-medium text-secondary-700">Endpoint</label>
                  <p className="text-secondary-900 font-mono text-sm">{selectedError.endpoint}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary-700">Severity</label>
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(selectedError.severity)}
                    <span className="capitalize">{selectedError.severity}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-secondary-700">Category</label>
                  <p className="text-secondary-900">{selectedError.category || 'Uncategorized'}</p>
                </div>
              </div>

              {!selectedError.is_resolved && (
                <div className="border-t border-secondary-200 pt-4">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Resolution Notes
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={3}
                    className="input resize-none"
                    placeholder="Describe how this error was resolved..."
                  />
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => setSelectedError(null)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleResolveError(selectedError.id)}
                      disabled={!resolutionNotes.trim() || resolveErrorMutation.isPending}
                      className="btn-primary"
                    >
                      {resolveErrorMutation.isPending ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Resolving...
                        </>
                      ) : (
                        'Mark as Resolved'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}