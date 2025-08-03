import React from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Download,
  BarChart3
} from 'lucide-react'
import { useBrands, useUploadServerLog, useLogUploadStatus } from '../hooks/useApi'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { formatFileSize, formatRelativeTime, cn } from '../../lib/utils'

export const LogAnalysisPage: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = React.useState('')
  const [logFormat, setLogFormat] = React.useState('nginx')
  const [timezone, setTimezone] = React.useState('UTC')
  const [uploadedFiles, setUploadedFiles] = React.useState<string[]>([])

  const { data: brandsData } = useBrands()
  const uploadMutation = useUploadServerLog()

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    if (!selectedBrand) {
      alert('Please select a brand first')
      return
    }

    for (const file of acceptedFiles) {
      try {
        const result = await uploadMutation.mutateAsync({
          file,
          brandId: selectedBrand,
          logFormat,
          timezone,
        })
        
        setUploadedFiles(prev => [...prev, result.upload_id])
      } catch (error) {
        // Error handled in mutation
      }
    }
  }, [selectedBrand, logFormat, timezone, uploadMutation])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.log', '.txt'],
      'application/gzip': ['.gz'],
      'application/x-gzip': ['.gz'],
    },
    maxSize: 1024 * 1024 * 1024, // 1GB
  })

  const brands = brandsData?.brands || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Server Log Analysis</h1>
        <p className="text-secondary-600 mt-1">
          Upload and analyze your server logs to track real AI bot activity
        </p>
      </div>

      {/* Configuration */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Upload Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Select Brand *
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="input"
            >
              <option value="">Choose a brand...</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Log Format
            </label>
            <select
              value={logFormat}
              onChange={(e) => setLogFormat(e.target.value)}
              className="input"
            >
              <option value="nginx">Nginx</option>
              <option value="apache">Apache</option>
              <option value="cloudflare">Cloudflare</option>
              <option value="aws-alb">AWS ALB</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="input"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
        </div>
      </div>

      {/* File upload */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Upload Log Files</h3>
        
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragActive
              ? 'border-primary-400 bg-primary-50'
              : 'border-secondary-300 hover:border-secondary-400',
            !selectedBrand && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} disabled={!selectedBrand} />
          
          <Upload className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          
          {isDragActive ? (
            <p className="text-lg text-primary-600">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-lg text-secondary-900 mb-2">
                Drag & drop log files here, or click to select
              </p>
              <p className="text-sm text-secondary-500">
                Supports .log, .txt, and .gz files up to 1GB
              </p>
            </div>
          )}
          
          {!selectedBrand && (
            <p className="text-sm text-warning-600 mt-2">
              Please select a brand first
            </p>
          )}
        </div>

        <div className="mt-4 text-sm text-secondary-600">
          <h4 className="font-medium mb-2">Supported formats:</h4>
          <ul className="space-y-1 text-xs">
            <li>• <strong>Nginx:</strong> Combined log format with response time</li>
            <li>• <strong>Apache:</strong> Common and combined log formats</li>
            <li>• <strong>Cloudflare:</strong> Standard Cloudflare log format</li>
            <li>• <strong>AWS ALB:</strong> Application Load Balancer logs</li>
          </ul>
        </div>
      </div>

      {/* Upload status */}
      {uploadedFiles.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Upload Status</h3>
          <div className="space-y-4">
            {uploadedFiles.map((uploadId) => (
              <UploadStatusCard key={uploadId} uploadId={uploadId} />
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">How to Get Your Server Logs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-secondary-900 mb-2">Nginx</h4>
            <div className="bg-secondary-900 rounded-lg p-4 text-sm text-secondary-100 font-mono">
              <div>sudo tail -n 10000 /var/log/nginx/access.log &gt; logs.txt</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-secondary-900 mb-2">Apache</h4>
            <div className="bg-secondary-900 rounded-lg p-4 text-sm text-secondary-100 font-mono">
              <div>sudo tail -n 10000 /var/log/apache2/access.log &gt; logs.txt</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary-900">Privacy & Security</h4>
              <p className="text-sm text-primary-700 mt-1">
                Log files are processed securely and deleted after analysis. We only extract bot activity data and never store personal information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Upload status component
const UploadStatusCard: React.FC<{ uploadId: string }> = ({ uploadId }) => {
  const { data: status, isLoading } = useLogUploadStatus(uploadId)

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-lg">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-secondary-600">Loading upload status...</span>
      </div>
    )
  }

  if (!status) {
    return null
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-500" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-error-500" />
      case 'processing':
        return <Clock className="w-5 h-5 text-warning-500" />
      default:
        return <FileText className="w-5 h-5 text-secondary-500" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'completed':
        return 'border-success-200 bg-success-50'
      case 'failed':
        return 'border-error-200 bg-error-50'
      case 'processing':
        return 'border-warning-200 bg-warning-50'
      default:
        return 'border-secondary-200 bg-secondary-50'
    }
  }

  return (
    <div className={cn('p-4 rounded-lg border', getStatusColor())}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <p className="font-medium text-secondary-900">{status.filename}</p>
            <p className="text-sm text-secondary-600">
              {formatFileSize(status.file_size_mb * 1024 * 1024)} • {formatRelativeTime(status.uploaded_at)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
            status.status === 'completed' ? 'text-success-800 bg-success-100' :
            status.status === 'failed' ? 'text-error-800 bg-error-100' :
            status.status === 'processing' ? 'text-warning-800 bg-warning-100' :
            'text-secondary-800 bg-secondary-100'
          )}>
            {status.status}
          </span>
        </div>
      </div>

      {status.status === 'completed' && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-secondary-600">Total Requests:</span>
            <span className="font-medium text-secondary-900 ml-1">
              {status.total_requests?.toLocaleString() || 0}
            </span>
          </div>
          <div>
            <span className="text-secondary-600">Bot Requests:</span>
            <span className="font-medium text-secondary-900 ml-1">
              {status.bot_requests?.toLocaleString() || 0}
            </span>
          </div>
          <div>
            <span className="text-secondary-600">Unique Bots:</span>
            <span className="font-medium text-secondary-900 ml-1">
              {status.unique_bots?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      )}

      {status.status === 'failed' && status.error && (
        <div className="mt-4 p-3 bg-error-100 rounded-lg">
          <p className="text-sm text-error-700">{status.error}</p>
        </div>
      )}
    </div>
  )
}