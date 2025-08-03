import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Building2, ExternalLink, Activity, Calendar } from 'lucide-react'
import { useBrands } from '../hooks/useApi'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { formatRelativeTime, cn } from '../lib/utils'

export const BrandsPage: React.FC = () => {
  const { data: brandsData, isLoading } = useBrands()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const brands = brandsData?.brands || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Brands</h1>
          <p className="text-secondary-600 mt-1">
            Manage your brands and their AI optimization settings
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Brand
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Brands</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">
                {brands.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Active Tracking</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">
                {brands.filter(b => b.tracking_enabled).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Script Installed</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">
                {brands.filter(b => b.tracking_script_installed).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Brands list */}
      {brands.length > 0 ? (
        <div className="card">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Last Analysis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {brand.name}
                          </div>
                          {brand.website_url && (
                            <div className="text-sm text-secondary-500 flex items-center">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {new URL(brand.website_url).hostname}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {brand.industry || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          brand.tracking_enabled
                            ? 'text-success-800 bg-success-100'
                            : 'text-secondary-800 bg-secondary-100'
                        )}>
                          {brand.tracking_enabled ? 'Active' : 'Inactive'}
                        </span>
                        {brand.tracking_script_installed && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-primary-800 bg-primary-100">
                            Script Installed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {brand.last_analysis ? formatRelativeTime(brand.last_analysis) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/brands/${brand.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </Link>
                        <span className="text-secondary-300">|</span>
                        <Link
                          to={`/analysis?brand=${brand.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Analyze
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <Building2 className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No brands yet</h3>
          <p className="text-secondary-500 mb-6">
            Add your first brand to start tracking AI bot activity and optimizing your content.
          </p>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Brand
          </button>
        </div>
      )}
    </div>
  )
}