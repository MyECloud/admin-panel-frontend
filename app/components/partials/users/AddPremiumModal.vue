<script setup lang="ts">
import type { ApiUser } from '~/types/user'

const props = withDefaults(defineProps<{
  users?: ApiUser[]
  open?: boolean
}>(), {
  users: () => [],
  open: false,
})

const emit = defineEmits<{
  success: []
  'update:open': [value: boolean]
}>()

const { $api } = useNuxtApp()
const toast = useToast()

const open = useVModel(props, 'open', emit, { defaultValue: false, passive: true })
const additionalMonths = ref(1)
const loading = ref(false)

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} ${i + 1 === 1 ? 'mese' : 'mesi'}`,
  value: i + 1
}))

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function resetForm() {
  additionalMonths.value = 1
}

async function onSubmit() {
  loading.value = true
  try {
    const promises = props.users.map(user =>
      $api(`/admin/users/${user.id}/subscription`, {
        method: 'PUT',
        body: { additionalMonths: additionalMonths.value }
      })
    )
    await Promise.all(promises)

    toast.add({
      title: 'Premium aggiunto',
      description: `${additionalMonths.value} ${additionalMonths.value === 1 ? 'mese' : 'mesi'} di premium ${props.users.length === 1 ? 'aggiunto' : 'aggiunti'} con successo.`,
      color: 'success'
    })
    open.value = false
    resetForm()
    emit('success')
  }
  catch (error) {
    toast.add({
      title: 'Errore',
      description: 'Si è verificato un errore durante l\'aggiunta del premium.',
      color: 'error'
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Aggiungi premium a ${users.length} ${users.length === 1 ? 'utente' : 'utenti'}`"
    :description="`Seleziona il numero di mesi da aggiungere.`"
  >
    <slot />

    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Numero di mesi">
          <USelect
            v-model="additionalMonths"
            :items="monthOptions"
            class="w-full"
          />
        </UFormField>

        <div class="text-sm text-muted">
          <p class="mb-1 font-medium">Utenti selezionati:</p>
          <ul class="list-disc pl-4">
            <li v-for="user in users" :key="user.id">
              {{ user.name }} (@{{ user.username }})
              <span v-if="user.premium?.isActive" class="text-xs text-green-500 ml-1">
                — Premium scade il {{ formatDate(user.premium.expiration) }}
              </span>
              <span v-else class="text-xs text-gray-400 ml-1">
                — Nessun premium attivo
              </span>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Annulla"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="Aggiungi premium"
          color="success"
          variant="solid"
          :loading="loading"
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
