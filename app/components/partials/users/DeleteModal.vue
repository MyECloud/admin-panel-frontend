<script setup lang="ts">
const props = withDefaults(defineProps<{
  users?: any[]
}>(), {
  users: []
})

const emit = defineEmits<{
  success: []
}>()

const { $api } = useNuxtApp()
const toast = useToast()

const open = ref(false)

async function onSubmit() {
  try {
    const results = await Promise.allSettled(
      props.users.map(user =>
        $api(`/admin/users/${user.id}`, {
          method: 'DELETE'
        })
      )
    )

    const successCount = results.filter(r => r.status === 'fulfilled').length
    const failedCount = results.filter(r => r.status === 'rejected').length

    toast.add({
      title: 'Operazione completata',
      description: `${successCount} utenti eliminati, ${failedCount} errori`,
      color: failedCount ? 'warning' : 'success'
    })

    open.value = false
    emit('success')
  } catch (error) {
    toast.add({
      title: 'Errore',
      description: 'Errore durante l’eliminazione utenti',
      color: 'error'
    })
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Cancella ${users.length} utenti`"
    :description="`Sei sicuro? Questa operazione non può essere annullata.`"
  >
    <slot />

    <template #body>
      <ul class="list-unstyled">
        <li v-for="user in users" :key="user.id">
          {{ user.username }} {{ user.email }}
        </li>
      </ul>
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
          label="Delete"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
