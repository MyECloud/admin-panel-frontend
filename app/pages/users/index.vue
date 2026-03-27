<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import type { Row } from '@tanstack/table-core'
import type { User, PaginatedResponse, ApiUser } from '~/types/user'

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')
const { $api } = useNuxtApp()

const page = ref(1)
const pageSize = ref(10)

const columnFilters = ref([{
  id: 'email',
  value: ''
}])
const columnVisibility = ref()
const rowSelection = ref({})

const { data: response, status, refresh } = await useAsyncData(
  'users-list',
  () => {
    console.log('[Users] Fetching users — page:', page.value, 'limit:', pageSize.value)
    return $api<PaginatedResponse<ApiUser>>('/admin/users', {
      query: { page: page.value, limit: pageSize.value }
    }).catch((err) => {
      console.error('[Users] API error:', err)
      return null
    })
  },
  {
    server: false,
    watch: [page, pageSize]
  }
)

watchEffect(() => {
  console.log('[Users] Response:', response.value)
  console.log('[Users] Status:', status.value)
})

const data = computed(() => response.value?.items ?? [])
const totalItems = computed(() => response.value?.meta?.totalItems ?? 0)

function getRowItems(row: Row<ApiUser>) {
  return [
    {
      type: 'label',
      label: 'Azioni'
    },
    {
      label: 'Vai al profilo pubblico',
      icon: 'i-lucide-user-check'
    },
    {
      type: 'separator'
    },
    {
      label: 'Sospendi',
      icon: 'i-lucide-user-x',
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString())
        toast.add({
          title: 'Copied to clipboard',
          description: 'Customer ID copied to clipboard'
        })
      }
    },
    {
      label: 'Elimina utente',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        toast.add({
          title: 'Elimina utente',
          description: 'L\'utente è stato eliminato.'
        })
      }
    }
  ]
}

const columns: TableColumn<ApiUser>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': 'Select row'
      })
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Utente',
    cell: ({ row }) => {
      const NuxtLink = resolveComponent('NuxtLink')
      return h(NuxtLink, {
        to: `/users/${row.original.id}`,
        class: 'flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 p-1 -m-1 rounded-lg transition-colors group cursor-pointer'
      }, () => [
        h(UAvatar, {
          src: row.original.avatarUrl || undefined,
          alt: row.original.name,
          size: 'lg'
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted group-hover:underline' }, row.original.name),
          h('p', { class: 'text-sm text-muted' }, `@${row.original.username}`)
        ])
      ])
    }
  },
  {
    accessorKey: 'type',
    header: 'Tipologia',
    filterFn: 'equals',
    cell: ({ row }) => {
      const label = row.original.type === 'escort' ? 'Escort' : 'Utente'
      const color = row.original.type === 'escort' ? 'primary' : 'neutral'
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Stato',
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          variant: 'subtle',
          color: row.original.isActive ? 'success' : 'error'
        },
        () => (row.original.isActive ? 'Attivo' : 'Disattivo')
      )
    }
  },
  {
    id: 'premium',
    header: 'Premium',
    cell: ({ row }) => {
      const isPremium = row.original.premium?.isActive
      return h(
        UBadge,
        {
          variant: 'subtle',
          color: isPremium ? 'success' : 'neutral'
        },
        () => (isPremium ? 'Attivo' : 'No')
      )
    }
  },
  {
    accessorKey: 'supporter',
    header: 'Supporter',
    cell: ({ row }) => {
      const isSupporter = !!row.original.supporter
      return h(
        UBadge,
        {
          variant: 'subtle',
          color: isSupporter ? 'success' : 'neutral'
        },
        () => (isSupporter ? 'Sì' : 'No')
      )
    }
  },
  {
    accessorKey: 'newContents',
    header: 'Nuovi contenuti',
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          variant: 'subtle',
          color: row.original.newContents ? 'primary' : 'neutral'
        },
        () => (row.original.newContents ? 'Sì' : 'No')
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
  }
]

const statusFilter = ref('all')
const typeFilter = ref('all')

watch(statusFilter, (newVal) => {
  columnFilters.value = columnFilters.value.filter(
    f => f.id !== 'isActive' && f.id !== 'premium'
  )

  if (newVal === 'active') {
    columnFilters.value.push({ id: 'isActive', value: true })
  }

  if (newVal === 'inactive') {
    columnFilters.value.push({ id: 'isActive', value: false })
  }

  if (newVal === 'premium') {
    columnFilters.value.push({ id: 'premium', value: true })
  }
})

watch(typeFilter, (newVal) => {
  columnFilters.value = columnFilters.value.filter(
    f => f.id !== 'type'
  )

  if (newVal !== 'all') {
    columnFilters.value.push({ id: 'type', value: newVal })
  }
})

const selectedUsers = computed<User>((): User => {
  if (!table?.value?.tableApi) return []
  return table.value.tableApi
    .getFilteredSelectedRowModel()
    .rows.map((row: Row<User>) => row.original)
})

const usernameFilter = computed({
  get: (): string => {
    return (table.value?.tableApi?.getColumn('name')?.getFilterValue() as string) || ''
  },
  set: (value: string) => {
    table.value?.tableApi?.getColumn('name')?.setFilterValue(value || undefined)
  }
})

const pagination = computed({
  get: () => ({
    pageIndex: page.value - 1,
    pageSize: pageSize.value
  }),
  set: (val) => {
    page.value = val.pageIndex + 1
    pageSize.value = val.pageSize
  }
})
</script>

<template>
  <UDashboardPanel id="customers">
    <template #header>
      <UDashboardNavbar title="Utenti">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="usernameFilter"
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="Cerca utenti..."
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <EcUsersAddPremiumModal :users="selectedUsers">
            <UButton
              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
              label="Aggiungi premium"
              color="success"
              variant="subtle"
              icon="i-lucide-plus"
            >
              <template #trailing>
                <UKbd>
                  {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                </UKbd>
              </template>
            </UButton>
          </EcUsersAddPremiumModal>
          <EcUsersDisableProfileModal :users="selectedUsers">
            <UButton
              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
              label="Disattiva profilo"
              color="warning"
              variant="subtle"
              icon="i-lucide-plus"
            >
              <template #trailing>
                <UKbd>
                  {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                </UKbd>
              </template>
            </UButton>
          </EcUsersDisableProfileModal>
          <EcUsersDeleteModal :users="selectedUsers">
            <UButton
              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
              label="Elimina"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
            >
              <template #trailing>
                <UKbd>
                  {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                </UKbd>
              </template>
            </UButton>
          </EcUsersDeleteModal>

          <USelect
            v-model="typeFilter"
            :items="[
              { label: 'Tutti i tipi', value: 'all' },
              { label: 'Escort', value: 'escort' },
              { label: 'Utente', value: 'user' }
            ]"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            placeholder="Tipo"
            class="min-w-28"
          />
          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'Tutti', value: 'all' },
              { label: 'Attivi', value: 'active' },
              { label: 'Disattivati', value: 'inactive' },
              { label: 'Premium', value: 'premium' }
            ]"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            placeholder="Filter status"
            class="min-w-28"
          />
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="Colonne"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

      <div v-if="status === 'pending'" class="flex flex-col items-center justify-center py-12 gap-3">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-primary" />
        <p class="text-sm text-muted">Caricamento utenti...</p>
      </div>

      <UTable
        v-else
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :row-count="totalItems"
        :pagination-options="{
          manualPagination: true
        }"
        class="shrink-0"
        :data="data"
        :columns="columns"
        :loading="status === 'pending'"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0'
        }"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} di
          {{ totalItems }} utenti totali.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="page"
            :items-per-page="pageSize"
            :total="totalItems"
            @update:page="(p: number) => { page = p }"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
