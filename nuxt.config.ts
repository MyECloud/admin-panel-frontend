// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@vee-validate/nuxt',
    '@pinia/nuxt',
    '@sidebase/nuxt-auth',
    '@nuxtjs/turnstile'
  ],

  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
      prefix: 'Ec'
    },
    {
      path: '~/components/partials',
      pathPrefix: true,
      prefix: 'Ec'
    }
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      APIBaseURL: ''
    }
  },

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2024-07-11',

  auth: {
    globalAppMiddleware: {
      isEnabled: true,
      allow404WithoutAuth: false
    },
    provider: {
      type: 'local',
      pages: {
        login: '/login'
      },
      endpoints: {
        signIn: { path: '/auth/signin', method: 'post' },
        signOut: { path: '/auth/logout', method: 'post' },
        getSession: { path: '/users/me', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: '/accessToken',
        maxAgeInSeconds: 60 * 60 * 24 * 15
      },
      refresh: {
        isEnabled: false,
        endpoint: {
          path: '/auth/refreshToken',
          method: 'post'
        },
        token: {
          signInResponseRefreshTokenPointer: '/refreshToken',
          refreshResponseTokenPointer: '/accessToken'
        }
      }
    },
    sessionRefresh: {
      enableOnWindowFocus: true,
      enablePeriodically: 60 * 1000
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  pinia: {
    storesDirs: ['app/stores/**']
  },

  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage'
    }
  }
})
