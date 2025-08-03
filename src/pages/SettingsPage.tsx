import React from 'react'
import { 
  User, 
  Bell, 
  Shield, 
  Key, 
  Globe,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../stores/authStore'
import { LoadingSpinner } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface SettingsForm {
  full_name: string
  company: string
  timezone: string
  email_notifications: boolean
  weekly_reports: boolean
}

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('profile')
  const [showApiKey, setShowApiKey] = React.useState(false)
  const { user, updateUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<SettingsForm>({
    defaultValues: {
      full_name: user?.full_name || '',
      company: user?.company || '',
      timezone: 'UTC',
      email_notifications: true,
      weekly_reports: true,
    },
  })

  const onSubmit = async (data: SettingsForm) => {
    try {
      // Here you would call your API to update user settings
      updateUser(data)
      toast.success('Settings updated successfully')
      reset(data)
    } catch (error) {
      toast.error('Failed to update settings')
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'api', name: 'API Keys', icon: Key },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            {activeTab === 'profile' && (
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-6">Profile Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name
                    </label>
                    <input
                      {...register('full_name')}
                      type="text"
                      className="input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="input bg-secondary-50 text-secondary-500"
                    />
                    <p className="text-xs text-secondary-500 mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Company
                    </label>
                    <input
                      {...register('company')}
                      type="text"
                      className="input"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Timezone
                    </label>
                    <select {...register('timezone')} className="input">
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
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-6">Notification Preferences</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-secondary-900">Email Notifications</h4>
                      <p className="text-sm text-secondary-500">
                        Receive email notifications for important updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        {...register('email_notifications')}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-secondary-900">Weekly Reports</h4>
                      <p className="text-sm text-secondary-500">
                        Receive weekly analysis reports via email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        {...register('weekly_reports')}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-6">Password</h3>
                  <button className="btn-outline">
                    Change Password
                  </button>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-6">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-900">Enhance your account security</p>
                      <p className="text-sm text-secondary-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="btn-outline">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-6">API Keys</h3>
                
                <div className="space-y-6">
                  <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-warning-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-warning-900">Keep your API keys secure</h4>
                        <p className="text-sm text-warning-700 mt-1">
                          Never share your API keys publicly or commit them to version control.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Your API Key
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value="aoe_1234567890abcdef1234567890abcdef"
                          readOnly
                          className="input pr-10 font-mono text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('aoe_1234567890abcdef1234567890abcdef')
                          toast.success('API key copied to clipboard')
                        }}
                        className="btn-outline"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <button className="btn-outline text-error-600 border-error-300 hover:bg-error-50">
                      Regenerate API Key
                    </button>
                    <p className="text-xs text-secondary-500 mt-1">
                      This will invalidate your current API key
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Save button */}
            {(activeTab === 'profile' || activeTab === 'notifications') && (
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={!isDirty}
                  className="btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}