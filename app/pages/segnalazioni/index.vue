<script setup lang="ts">
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Segnalazioni">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col items-center justify-center h-64 gap-4 text-gray-400 dark:text-gray-500">
        <UIcon name="i-lucide-flag" class="w-12 h-12" />
        <p class="text-sm">
          Nessuna segnalazione al momento.
        </p>
      </div>
    </template>
  </UDashboardPanel>
</template>
