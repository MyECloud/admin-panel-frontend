<script setup lang="ts">
withDefaults(defineProps<{
  users?: Array
}>(), {
  users: []
})

const open = ref(false)

async function onSubmit() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Disabilita ${users.length} utenti`"
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
          label="Disabilita"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
