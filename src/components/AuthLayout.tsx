import React from 'react'
import { Outlet } from 'react-router-dom'
import { Bot, Sparkles, TrendingUp, Shield } from 'lucide-react'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Optimization Engine</h1>
              <p className="text-primary-100">Real-time LLM bot tracking & analysis</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real Citation Metrics</h3>
                <p className="text-primary-100 text-sm">
                  Track actual AI bot visits and citations instead of simulated data
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">12-Metric Analysis</h3>
                <p className="text-primary-100 text-sm">
                  Comprehensive optimization metrics for ChatGPT, Claude, Gemini & more
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enterprise Security</h3>
                <p className="text-primary-100 text-sm">
                  Bank-grade security with role-based access and audit trails
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-primary-100 text-sm">
          <p>Trusted by 500+ brands worldwide</p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-white/20 rounded-full border-2 border-primary-600 backdrop-blur-sm"
                />
              ))}
            </div>
            <span className="text-xs">+496 more</span>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}