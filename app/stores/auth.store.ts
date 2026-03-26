import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const { signIn, data, signOut, refresh: refreshToken, getSession } = useAuth()

  // Methods
  const login = async (usernameOrEmail: string, password: string, captchaToken: string) =>
    signIn({ user: usernameOrEmail, password, captchaToken }, { redirect: false })

  const refresh = async () => refreshToken()

  const logout = async (redirect = true) =>
    signOut({ redirect, callbackUrl: '/login' })

  const updateSession = () => getSession()

  return {
    data,
    login,
    refresh,
    logout,
    updateSession
  }
})
