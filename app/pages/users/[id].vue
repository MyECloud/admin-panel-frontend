<script setup lang="ts">
const route = useRoute()
const userName = ref(`Utente ${route.params.id}`)
const isSuspended = ref(false)
const isSuspendModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const deleteModalState = ref({
  title: 'Elimina account',
  description: 'Questa azione è irreversibile. Sei sicuro di voler eliminare definitivamente',
  itemName: ''
})

const openDeleteModal = (title: string, description: string, itemName: string) => {
  deleteModalState.value = { title, description, itemName }
  isDeleteModalOpen.value = true
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
      <div class="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-8">
        <div class="flex items-center justify-center gap-3 w-full">
          <UButton
            icon="i-heroicons-user-minus"
            :color="isSuspended ? 'error' : 'neutral'"
            variant="ghost"
            class="transition-colors hover:text-error dark:hover:text-error disabled:opacity-100"
            :class="{ 'text-error dark:text-error': isSuspended, 'text-primary-500 dark:text-primary-400': !isSuspended }"
            @click="isSuspendModalOpen = true"
          />
          <UButton
            icon="i-heroicons-trash"
            color="neutral"
            variant="ghost"
            class="transition-colors hover:text-error dark:hover:text-error text-primary-500 dark:text-primary-400"
            @click="openDeleteModal('Elimina account', 'Questa azione è irreversibile. Sei sicuro di voler eliminare definitivamente l\'utente', userName)"
          />
        </div>

        <!-- Nome Utente -->
        <UCard class="flex items-center justify-center font-bold text-xl py-2">
          {{ userName }}
        </UCard>

        <!-- Documents States -->
        <UCard>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-4 text-center">
            <div class="flex flex-col gap-2 sm:gap-4">
              <div class="text-xs sm:text-sm font-bold text-primary-500 dark:text-primary-400 leading-tight">
                Documenti<br>Inviati
              </div>
              <div class="text-green-500 font-bold text-sm sm:text-base">
                Si
              </div>
            </div>
            <div class="flex flex-col gap-2 sm:gap-4">
              <div class="text-xs sm:text-sm font-bold text-primary-500 dark:text-primary-400 leading-tight">
                Documenti<br>Ricevuti
              </div>
              <div class="text-green-500 font-bold text-sm sm:text-base">
                Si
              </div>
            </div>
            <div class="flex flex-col gap-2 sm:gap-4">
              <div class="text-xs sm:text-sm font-bold text-primary-500 dark:text-primary-400 leading-tight">
                Documenti<br>Archiviati
              </div>
              <div class="text-red-500 font-bold text-sm sm:text-base">
                No
              </div>
            </div>
            <div class="flex flex-col gap-2 sm:gap-4">
              <div class="text-xs sm:text-sm font-bold text-primary-500 dark:text-primary-400 leading-tight">
                Documenti<br>verificati
              </div>
              <div class="text-red-500 font-bold text-sm sm:text-base">
                No
              </div>
            </div>
          </div>
        </UCard>

        <!-- Premium section header -->
        <div class="text-center font-bold text-lg text-primary-700 dark:text-primary-300 mt-2">
          Premium
        </div>

        <UCard>
          <!-- Headers -->
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
            <div class="text-green-500 font-bold text-center">
              Attivo
            </div>
            <div class="text-gray-600 dark:text-gray-300 text-center text-sm">
              01/10/26
            </div>
            <div class="flex items-center justify-center gap-2">
              <UButton
                icon="i-heroicons-trash"
                color="neutral"
                variant="ghost"
                @click="openDeleteModal('Rimuovi stato Premium', 'Vuoi davvero rimuovere lo stato Premium per', userName)"
              />
              <UButton icon="i-heroicons-pencil-square" color="neutral" variant="ghost" />
            </div>
          </div>
        </UCard>

        <!-- Tabs Section -->
        <UCard>
          <div class="grid grid-cols-3 gap-4 items-center h-full">
            <div class="text-center text-sm font-bold text-primary-900 dark:text-primary-100 leading-tight">
              Testi<br>campo libero
            </div>
            <div class="text-center text-sm font-bold text-primary-900 dark:text-primary-100">
              Media
            </div>
            <div class="flex justify-center">
              <div class="bg-primary-50 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400 px-4 py-2 rounded-lg text-sm font-bold text-center leading-tight">
                Verifica<br>Documenti
              </div>
            </div>
          </div>
        </UCard>

        <!-- Files List -->
        <UCard>
          <!-- Table Headers -->
          <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-primary-50/50 dark:bg-primary-900/10 rounded-t-lg">
            <div class="col-span-5 text-sm font-semibold text-primary-500 dark:text-primary-400 text-center">
              Nome File
            </div>
            <div class="col-span-4 text-sm font-semibold text-primary-500 dark:text-primary-400 text-center">
              Previw
            </div>
            <div class="col-span-3 text-sm font-semibold text-primary-500 dark:text-primary-400 text-center">
              Azioni
            </div>
          </div>

          <!-- Rows -->
          <div class="flex flex-col">
            <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 items-center">
              <div class="col-span-5 flex items-center gap-3">
                <UIcon name="i-heroicons-bars-4" class="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0 cursor-move" />
                <UCheckbox />
                <span class="text-sm text-gray-600 dark:text-gray-300 truncate">Nome file</span>
              </div>
              <div class="col-span-4 flex justify-center">
                <div class="w-16 h-10 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
              <div class="col-span-3 flex items-center justify-center gap-2">
                <UButton
                  icon="i-heroicons-check"
                  color="neutral"
                  variant="ghost"
                  class="text-gray-700 dark:text-gray-300"
                />
                <UButton
                  icon="i-heroicons-trash"
                  color="neutral"
                  variant="ghost"
                  class="text-gray-700 dark:text-gray-300"
                  @click="openDeleteModal('Elimina file', 'Questa azione è irreversibile. Sei sicuro di voler eliminare definitivamente il file', 'Nome file 1')"
                />
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 items-center">
              <div class="col-span-5 flex items-center gap-3">
                <UIcon name="i-heroicons-bars-4" class="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0 cursor-move" />
                <UCheckbox />
                <span class="text-sm text-gray-600 dark:text-gray-300 truncate">Nome file</span>
              </div>
              <div class="col-span-4 flex justify-center">
                <div class="w-16 h-10 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
              <div class="col-span-3 flex items-center justify-center gap-2">
                <UButton
                  icon="i-heroicons-check"
                  color="neutral"
                  variant="ghost"
                  class="text-gray-700 dark:text-gray-300"
                />
                <UButton
                  icon="i-heroicons-trash"
                  color="neutral"
                  variant="ghost"
                  class="text-gray-700 dark:text-gray-300"
                  @click="openDeleteModal('Elimina file', 'Questa azione è irreversibile. Sei sicuro di voler eliminare definitivamente il file', 'Nome file 2')"
                />
              </div>
            </div>

            <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center">
              <div class="col-span-5 flex items-center gap-3">
                <UIcon name="i-heroicons-bars-4" class="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0 cursor-move" />
                <UCheckbox />
                <span class="text-sm text-gray-600 dark:text-gray-300 truncate">Nome file</span>
              </div>
              <div class="col-span-4 flex justify-center">
                <div class="w-16 h-10 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
              <div class="col-span-3 flex items-center justify-center gap-2">
                <UButton
                  icon="i-heroicons-check"
                  color="neutral"
                  variant="ghost"
                  class="text-gray-700 dark:text-gray-300"
                />
                <UButton
                  icon="i-heroicons-trash"
                  color="neutral"
                  variant="ghost"
                  class="text-gray-700 dark:text-gray-300"
                  @click="openDeleteModal('Elimina file', 'Questa azione è irreversibile. Sei sicuro di voler eliminare definitivamente il file', 'Nome file 3')"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Modal for Suspend/Unsuspend -->
  <UModal
    v-model:open="isSuspendModalOpen"
    title="Conferma azione"
    :description="`Sei sicuro di voler ${isSuspended ? 'sbloccare' : 'sospendere'} l'utente ${userName}?`"
    :overlay="true"
    :ui="{ overlay: 'bg-black/50 backdrop-blur-sm' }"
  >
    <template #body>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="isSuspendModalOpen = false">
          Annulla
        </UButton>
        <UButton :color="isSuspended ? 'success' : 'error'" @click="isSuspended = !isSuspended; isSuspendModalOpen = false">
          {{ isSuspended ? 'Sblocca utente' : 'Sospendi utente' }}
        </UButton>
      </div>
    </template>
  </UModal>

  <!-- Modal for Delete -->
  <UModal
    v-model:open="isDeleteModalOpen"
    :title="deleteModalState.title"
    :description="`${deleteModalState.description} ${deleteModalState.itemName}?`"
    :overlay="true"
    :ui="{ overlay: 'bg-black/50 backdrop-blur-sm' }"
  >
    <template #body>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="isDeleteModalOpen = false">
          Annulla
        </UButton>
        <UButton color="error" @click="isDeleteModalOpen = false">
          Elimina utente
        </UButton>
      </div>
    </template>
  </UModal>
</template>
