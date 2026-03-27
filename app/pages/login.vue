<script setup lang="ts">
import { loginSchema } from '~/schemas/login.schema'
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({
  layout: 'auth',
  auth: 'guest'
})

useSeoMeta({ title: 'Login — Admin Panel' })

const authStore = useAuthStore()
const toast = useToast()

const turnstile = useTemplateRef('turnstile')
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit(values: Record<string, unknown>) {
  loading.value = true
  error.value = null

  try {
    await authStore.login(
      values.emailOrUsername as string,
      values.password as string,
      values.token as string
    )
    await navigateTo('/')
  } catch (err: any) {
    console.error('[Login] Auth error:', err)
    turnstile.value?.reset()

    const status = err?.response?.status ?? err?.statusCode ?? err?.data?.statusCode
    const message = err?.response?._data?.message ?? err?.data?.message ?? err?.message

    if (status === 401 || status === 403) {
      error.value = 'Credenziali non valide. Riprova.'
    } else if (status === 500) {
      error.value = `Errore del server: ${message || 'Riprova più tardi.'}`
    } else if (message) {
      error.value = message
    } else {
      error.value = 'Errore di connessione. Verifica che il backend sia raggiungibile.'
    }

    toast.add({
      title: 'Errore di autenticazione',
      description: error.value ?? undefined,
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-sm px-4">
    <div class="flex justify-center mb-8">
      <ClientOnly>
        <NuxtImg
          :src="$colorMode.value === 'light' ? '/images/logo_dark.svg' : '/images/logo_light.svg'"
          alt="ECloud"
          class="h-10"
        />
      </ClientOnly>
    </div>

    <UCard class="w-full">
      <template #header>
        <div class="text-center">
          <h1 class="text-xl font-semibold text-highlighted">
            Accedi all'Admin Panel
          </h1>
          <p class="text-sm text-muted mt-1">
            Inserisci le tue credenziali per continuare
          </p>
        </div>
      </template>

      <VeeForm
        :validation-schema="loginSchema"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Email o Username" name="emailOrUsername" required>
          <VeeField
            v-slot="{ field, errorMessage }"
            name="emailOrUsername"
          >
            <UInput
              v-bind="field"
              type="text"
              placeholder="nome@esempio.it oppure username"
              autocomplete="username"
              :color="errorMessage ? 'error' : undefined"
              class="w-full"
            />
            <p v-if="errorMessage" class="text-sm text-error mt-1">
              {{ errorMessage }}
            </p>
          </VeeField>
        </UFormField>

        <UFormField label="Password" name="password" required>
          <VeeField
            v-slot="{ field, errorMessage }"
            name="password"
          >
            <UInput
              v-bind="field"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              :color="errorMessage ? 'error' : undefined"
              class="w-full"
            />
            <p v-if="errorMessage" class="text-sm text-error mt-1">
              {{ errorMessage }}
            </p>
          </VeeField>
        </UFormField>

        <VeeField v-slot="{ handleChange }" name="token">
          <NuxtTurnstile
            ref="turnstile"
            class="flex justify-center"
            @update:model-value="handleChange"
          />
        </VeeField>

        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :description="error"
        />

        <UButton
          type="submit"
          block
          :loading="loading"
          :disabled="loading"
        >
          Accedi
        </UButton>
      </VeeForm>
    </UCard>
  </div>
</template>
