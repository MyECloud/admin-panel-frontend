import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const { signIn, signOut, refresh: refreshToken } = useAuth()

  // Methods
  const login = async (
    usernameOrEmail: string,
    password: string
  ) => {
    return signIn({
      user: usernameOrEmail,
      password
    }, { external: true })
  }

  const refresh = async () => {
    return refreshToken()
  }

  const logout = async (redirect = false) => {
    return signOut({ redirect, external: true })
  }

  return {
    // Methods
    login,
    refresh,
    logout
  }
})
