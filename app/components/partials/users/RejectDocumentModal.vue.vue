```vue
<script setup lang="ts">
import type { ApiUserDetail } from '~/types/user'

const props = defineProps<{
  user: Pick<ApiUserDetail, 'id' | 'name'>
  open?: boolean
}>()

const emit = defineEmits<{
  'success': []
  'update:open': [value: boolean]
}>()

const { $api } = useNuxtApp()
const toast = useToast()

const open = useVModel(props, 'open', emit, {
  defaultValue: false,
  passive: true
})

const loading = ref(false)

async function onRejectDocuments() {
  loading.value = true

  try {
    await $api(`/admin/escorts/${props.user.id}/reject`, {
      method: 'PATCH'
    })

    toast.add({
      title: 'Documenti rifiutati',
      color: 'success'
    })

    emit('success')
  } catch {
    toast.add({
      title: 'Errore durante il rifiuto dei documenti',
      description: 'Si è verificato un errore durante il rifiuto dei documenti.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Rifiuta documenti"
    :description="`Rifiuta i documenti di ${user.name}`"
  >
    <template #body>
      <div class="text-sm text-muted">
        <p>
          Sei sicuro di voler rifiutare i documenti di
          <strong>{{ user.name }}</strong>?
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Annulla"
          color="neutral"
          variant="subtle"
          :disabled="loading"
          @click="open = false"
        />

        <UButton
          label="Rifiuta documenti"
          color="error"
          variant="solid"
          :loading="loading"
          @click="onRejectDocuments"
        />
      </div>
    </template>
  </UModal>
</template>
```
