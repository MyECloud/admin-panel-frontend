import { StatusCodes } from 'http-status-codes'

export default defineNuxtPlugin((nuxtApp) => {
  const { token, status } = useAuth()
  const runtimeConfig = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: runtimeConfig.public.APIBaseURL,
    onRequest({ options }) {
      // determino gli headers
      if (status.value === 'authenticated' && options.credentials !== 'omit' && token.value) {
        options.headers.set('Authorization', token.value)
      }
    },

    async onResponseError({ response }) {
      if (response.status === StatusCodes.UNAUTHORIZED) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    }
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api
    }
  }
})
