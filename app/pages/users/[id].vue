<script setup lang="ts">
import type { ApiUserDetail } from '~/types/user'

const route = useRoute()
const { $api } = useNuxtApp()
const toast = useToast()

const userId = Number(route.params.id)

const { data: user, status, refresh } = await useAsyncData<ApiUserDetail>(
  `user-detail-${userId}`,
  () => $api<ApiUserDetail>(`/admin/users/${userId}`),
  { server: false }
)

// --- Suspend modal ---
const isSuspendModalOpen = ref(false)

// --- Delete account modal ---
const isDeleteModalOpen = ref(false)

// --- Add Premium modal ---
const isAddPremiumModalOpen = ref(false)

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

function boolLabel(val: boolean) {
  return val ? 'Sì' : 'No'
}

function docTypeLabel(type: string): string {
  if (type === 'front') return 'Fronte'
  if (type === 'back') return 'Retro'
  return type
}

async function onDeleteUser() {
  try {
    await $api(`/admin/users/${userId}`, { method: 'DELETE' })
    toast.add({ title: 'Utente eliminato', color: 'success' })
    navigateTo('/users')
  }
  catch {
    toast.add({ title: 'Errore durante l\'eliminazione', color: 'error' })
  }
  finally {
    isDeleteModalOpen.value = false
  }
}

async function onToggleSuspend() {
  try {
    await $api(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: { isActive: !user.value?.isActive },
    })
    toast.add({
      title: user.value?.isActive ? 'Utente sospeso' : 'Utente riattivato',
      color: 'success',
    })
    await refresh()
  }
  catch {
    toast.add({ title: 'Errore durante l\'operazione', color: 'error' })
  }
  finally {
    isSuspendModalOpen.value = false
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #trailing />
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Loading state -->
      <div v-if="status === 'pending'" class="flex items-center justify-center h-64">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8 text-primary-500" />
      </div>

      <!-- Error state -->
      <div v-else-if="status === 'error'" class="flex flex-col items-center justify-center h-64 gap-4">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10 text-red-500" />
        <p class="text-gray-500 dark:text-gray-400">
          Impossibile caricare i dati dell'utente.
        </p>
        <UButton label="Riprova" color="primary" variant="solid" @click="refresh()" />
      </div>

      <!-- Content -->
      <div v-else-if="user" class="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-8">

        <!-- Action buttons -->
        <div class="flex items-center justify-end gap-3 w-full">
          <UButton
            icon="i-heroicons-user-minus"
            :color="user.isActive ? 'neutral' : 'error'"
            variant="ghost"
            class="transition-colors hover:text-error dark:hover:text-error"
            :class="{ 'text-error dark:text-error': !user.isActive, 'text-primary-500 dark:text-primary-400': user.isActive }"
            :title="user.isActive ? 'Sospendi utente' : 'Riattiva utente'"
            @click="isSuspendModalOpen = true"
          />
          <UButton
            icon="i-heroicons-trash"
            color="neutral"
            variant="ghost"
            class="transition-colors hover:text-error dark:hover:text-error text-primary-500 dark:text-primary-400"
            title="Elimina utente"
            @click="isDeleteModalOpen = true"
          />
        </div>

        <!-- ── Sezione Anagrafica ── -->
        <UCard>
          <div class="flex flex-col sm:flex-row items-center gap-6 p-2">
            <!-- Avatar -->
            <UAvatar
              :src="user.avatarUrl ?? undefined"
              :alt="user.name"
              size="3xl"
              class="ring-2 ring-primary-400 dark:ring-primary-500 shrink-0"
            />

            <!-- Info -->
            <div class="flex flex-col gap-3 w-full">
              <!-- Nome e username -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ user.name }}</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">@{{ user.username }}</span>
              </div>

              <!-- Badges riga -->
              <div class="flex flex-wrap gap-2">
                <!-- ID -->
                <UBadge color="neutral" variant="subtle" class="font-mono text-xs">
                  ID #{{ user.id }}
                </UBadge>

                <!-- Tipologia -->
                <UBadge
                  :color="user.type === 'escort' ? 'primary' : 'neutral'"
                  variant="subtle"
                  class="capitalize"
                >
                  {{ user.type }}
                </UBadge>

                <!-- Stato profilo -->
                <UBadge
                  :color="user.isActive ? 'success' : 'error'"
                  variant="subtle"
                >
                  {{ user.isActive ? 'Attivo' : 'Sospeso' }}
                </UBadge>

                <!-- Premium -->
                <UBadge
                  v-if="user.isPremium"
                  color="warning"
                  variant="subtle"
                >
                  Premium
                </UBadge>
              </div>

              <!-- Supporter -->
              <div class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-semibold text-primary-500 dark:text-primary-400">Supporter: </span>
                <span>{{ user.supporter ?? '—' }}</span>
              </div>
            </div>
          </div>
        </UCard>

        <!-- ── Sezione Subscription ── -->
        <div class="text-sm font-bold uppercase tracking-wide text-primary-500 dark:text-primary-400 px-1">
          Subscription (Premium)
        </div>

        <UCard>
          <div v-if="user.subscription" class="flex flex-col gap-0">
            <!-- Header -->
            <div class="grid grid-cols-3 gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-primary-50/50 dark:bg-primary-900/10 rounded-t-lg">
              <div class="text-sm font-semibold text-primary-500 dark:text-primary-400 text-center">
                Status
              </div>
              <div class="text-sm font-semibold text-primary-500 dark:text-primary-400 text-center">
                Data Scadenza
              </div>
              <div class="text-sm font-semibold text-primary-500 dark:text-primary-400 text-center">
                Azioni
              </div>
            </div>
            <!-- Row -->
            <div class="grid grid-cols-3 gap-4 px-6 py-4 items-center">
              <div
                :class="user.subscription.isActive ? 'text-green-500' : 'text-red-500'"
                class="font-bold text-center"
              >
                {{ user.subscription.isActive ? 'Attiva' : 'Scaduta' }}
              </div>
              <div class="text-gray-600 dark:text-gray-300 text-center text-sm">
                {{ formatDate(user.subscription.expiration) }}
              </div>
              <div class="flex items-center justify-center">
                <UButton
                  icon="i-heroicons-plus"
                  color="success"
                  variant="ghost"
                  title="Aggiungi mesi premium"
                  @click="isAddPremiumModalOpen = true"
                />
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center gap-4 py-6">
            <p class="text-sm text-gray-400 dark:text-gray-500">
              Nessuna subscription attiva.
            </p>
            <UButton
              icon="i-heroicons-plus"
              label="Aggiungi Premium"
              color="success"
              variant="solid"
              size="sm"
              @click="isAddPremiumModalOpen = true"
            />
          </div>
        </UCard>

        <!-- ── Sezione Documenti ── -->
        <div class="text-sm font-bold uppercase tracking-wide text-primary-500 dark:text-primary-400 px-1">
          Documenti
        </div>

        <UCard>
          <!-- Status flags -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
            <div
              v-for="(flag, label) in {
                'Inviati': user.documents.sent,
                'Ricevuti': user.documents.received,
                'Archiviati': user.documents.archived,
                'Verificati': user.documents.verified,
              }"
              :key="label"
              class="flex flex-col gap-2"
            >
              <div class="text-xs sm:text-sm font-bold text-primary-500 dark:text-primary-400 leading-tight">
                Documenti<br>{{ label }}
              </div>
              <div :class="flag ? 'text-green-500' : 'text-red-500'" class="font-bold text-sm sm:text-base">
                {{ boolLabel(flag) }}
              </div>
            </div>
          </div>

          <!-- Document images -->
          <div v-if="user.documents.items.length > 0" class="flex flex-col gap-4">
            <div
              v-for="doc in user.documents.items"
              :key="doc.id"
              class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/40"
            >
              <!-- Thumbnail documento (formato carta d'identità ~1.58:1) -->
              <a :href="doc.url" target="_blank" rel="noopener noreferrer" class="shrink-0">
                <NuxtImg
                  :src="doc.url"
                  :alt="doc.name"
                  width="252"
                  height="160"
                  class="rounded-lg object-cover border border-gray-200 dark:border-gray-700 hover:opacity-90 transition-opacity"
                  style="width:252px; height:160px"
                />
              </a>
              <div class="flex flex-col gap-1 text-sm">
                <span class="font-semibold text-primary-600 dark:text-primary-400">
                  {{ docTypeLabel(doc.type) }}
                </span>
                <span class="text-gray-700 dark:text-gray-300 font-mono text-xs">{{ doc.name }}</span>
                <span class="text-gray-500 dark:text-gray-400 text-xs">
                  Inviato il {{ formatDate(doc.submittedAt) }}
                </span>
              </div>
            </div>
          </div>

          <p v-else class="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
            Nessun documento caricato.
          </p>
        </UCard>

      </div>
    </template>
  </UDashboardPanel>

  <!-- Modal Sospendi / Riattiva -->
  <UModal
    v-model:open="isSuspendModalOpen"
    title="Conferma azione"
    :description="user?.isActive
      ? `Sei sicuro di voler sospendere l'utente ${user?.name}?`
      : `Sei sicuro di voler riattivare l'utente ${user?.name}?`"
    :overlay="true"
    :ui="{ overlay: 'bg-black/50 backdrop-blur-sm' }"
  >
    <template #body>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="isSuspendModalOpen = false">
          Annulla
        </UButton>
        <UButton
          :color="user?.isActive ? 'error' : 'success'"
          @click="onToggleSuspend"
        >
          {{ user?.isActive ? 'Sospendi utente' : 'Riattiva utente' }}
        </UButton>
      </div>
    </template>
  </UModal>

  <!-- Modal Elimina utente -->
  <UModal
    v-model:open="isDeleteModalOpen"
    title="Elimina account"
    :description="`Questa azione è irreversibile. Sei sicuro di voler eliminare definitivamente l'utente ${user?.name}?`"
    :overlay="true"
    :ui="{ overlay: 'bg-black/50 backdrop-blur-sm' }"
  >
    <template #body>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="isDeleteModalOpen = false">
          Annulla
        </UButton>
        <UButton color="error" @click="onDeleteUser">
          Elimina utente
        </UButton>
      </div>
    </template>
  </UModal>

  <!-- Modal Aggiungi Premium -->
  <EcUsersAddPremiumModal
    v-if="user"
    v-model:open="isAddPremiumModalOpen"
    :users="[{ id: user.id, name: user.name, username: user.username, isActive: user.isActive, avatarUrl: user.avatarUrl, type: user.type, supporter: user.supporter, newContents: user.newContents, premium: user.subscription ? { isActive: user.subscription.isActive, expiration: user.subscription.expiration } : { isActive: false, expiration: null } }]"
    @success="refresh()"
  />
</template>
