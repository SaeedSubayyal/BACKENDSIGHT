import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginRequest, RegisterRequest } from '../types/api'
import { apiClient } from '../lib/api'
import { API_ENDPOINTS } from '../config/api'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post(API_ENDPOINTS.login, credentials)
          
          const { user, access_token } = response
          
          // Store token
          localStorage.setItem('auth_token', access_token)
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          })
          
          toast.success(`Welcome back, ${user.full_name || user.email}!`)
        } catch (error: any) {
          set({ isLoading: false })
          const message = error.response?.data?.error || 'Login failed'
          toast.error(message)
          throw error
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post(API_ENDPOINTS.register, userData)
          
          if (response.access_token) {
            // Auto-login after registration
            const { user, access_token } = response
            localStorage.setItem('auth_token', access_token)
            
            set({
              user,
              token: access_token,
              isAuthenticated: true,
              isLoading: false,
            })
            
            toast.success('Account created successfully!')
          } else {
            set({ isLoading: false })
            toast.success('Account created! Please check your email to verify.')
          }
        } catch (error: any) {
          set({ isLoading: false })
          const message = error.response?.data?.error || 'Registration failed'
          toast.error(message)
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        toast.success('Logged out successfully')
      },

      refreshUser: async () => {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null })
          return
        }

        try {
          // You might want to add a /me endpoint to your backend
          // For now, we'll assume the user data is still valid
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            const user = JSON.parse(storedUser)
            set({ user, token, isAuthenticated: true })
          }
        } catch (error) {
          console.error('Failed to refresh user:', error)
          get().logout()
        }
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates }
          set({ user: updatedUser })
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Initialize auth state on app load
export const initializeAuth = () => {
  const authStore = useAuthStore.getState()
  authStore.refreshUser()
}