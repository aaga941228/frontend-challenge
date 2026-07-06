<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { getTransactions } from '@services/transactions'
import { useNotify } from '@composables/useNotify'
import type { Transaction } from '@/types/transaction'
import formatCurrency from '@/utils/formatCurrency'
import formatDate from '@/utils/formatDate'

const { showError } = useNotify()

const loading = ref(false)
const rows = ref<Transaction[]>([])

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
})

const columns: QTableColumn[] = [
  {
    name: 'financialReference',
    label: 'Financial Reference',
    field: 'financialReference',
    align: 'left',
    sortable: true,
  },
  {
    name: 'approvalNumber',
    label: 'Approval Number',
    field: 'approvalNumber',
    align: 'left',
    sortable: true,
  },
  {
    name: 'name',
    label: 'Customer',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'card',
    label: 'Card',
    field: 'card',
    align: 'center',
  },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    align: 'right',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'center',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: 'Date',
    field: 'createdAt',
    align: 'left',
    sortable: true,
  },
]

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'approved':
      return 'Approved'
    case 'refund':
      return 'Refunded'
    case 'cancellation':
      return 'Cancelled'
    default:
      return status
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'positive'
    case 'cancellation':
      return 'negative'
    case 'refund':
      return 'warning'
    default:
      return 'grey'
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'sale':
      return 'Sale'
    case 'refund':
      return 'Refund'
    case 'cancellation':
      return 'Cancellation'
    default:
      return type
  }
}

const loadTransactions = async () => {
  try {
    loading.value = true

    const { data } = await getTransactions()

    rows.value = data
  } catch {
    showError('Error al obtener las transacciones')
  } finally {
    loading.value = false
  }
}

onMounted(loadTransactions)
</script>

<template>
  <q-page padding class="row justify-center">
    <div class="col-12" style="max-width: 1400px">
      <q-card flat bordered class="bg-white" style="border-radius: 12px">
        <q-card-section class="q-py-md q-px-lg flex items-center justify-between">
          <div class="text-h6 text-weight-bold text-grey-9">Transactions</div>

          <div v-if="!$q.screen.xs" class="text-caption text-grey-6">
            Viewing records {{ (pagination.page - 1) * pagination.rowsPerPage + 1 }} -
            {{ Math.min(pagination.page * pagination.rowsPerPage, rows.length) }}
          </div>
        </q-card-section>

        <q-table
          v-model:pagination="pagination"
          :rows="rows"
          :columns="columns"
          :loading="loading"
          :grid="$q.screen.xs"
          row-key="financialReference"
          flat
          class="text-grey-8"
          table-header-class="bg-grey-1 text-grey-9 text-weight-bold"
        >
          <template #body-cell-amount="props">
            <q-td :props="props" class="text-weight-medium text-grey-9">
              {{ formatCurrency(props.value) }}
            </q-td>
          </template>

          <template #body-cell-type="props">
            <q-td :props="props">
              {{ getTypeLabel(props.value) }}
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="getStatusColor(props.value)"
                outline
                class="q-px-md q-py-xs text-weight-bold text-uppercase"
                style="border-radius: 20px; font-size: 0.7rem; letter-spacing: 0.5px"
              >
                {{ getStatusLabel(props.value) }}
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-createdAt="props">
            <q-td :props="props" class="text-grey-6">
              {{ formatDate(props.value) }}
            </q-td>
          </template>

          <template #item="props">
            <div class="q-pa-sm col-xs-12 col-sm-6">
              <q-card flat bordered class="q-pa-md" style="border-radius: 8px">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-caption text-grey-6">
                    Ref: #{{ props.row.financialReference }}
                  </div>
                  <q-badge
                    :color="getStatusColor(props.row.status)"
                    outline
                    class="q-px-sm q-py-xs text-weight-bold text-uppercase"
                    style="border-radius: 20px; font-size: 0.65rem"
                  >
                    {{ getStatusLabel(props.row.status) }}
                  </q-badge>
                </div>

                <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-xs">
                  {{ props.row.customerName || props.row.customer || 'Customer' }}
                </div>

                <div
                  class="row justify-between items-center q-mt-md pt-sm border-top"
                  style="border-top: 1px dashed #f0f0f0"
                >
                  <div class="text-subtitle2 text-primary text-weight-bold">
                    {{ formatCurrency(props.row.amount) }}
                  </div>
                  <div class="text-caption text-grey-5">
                    {{ formatDate(props.row.createdAt) }}
                  </div>
                </div>
              </q-card>
            </div>
          </template>

          <template #no-data>
            <div class="full-width column items-center justify-center q-pa-xl text-grey-6">
              <q-icon name="receipt_long" size="48px" class="q-mb-sm text-grey-4" />
              <div class="text-weight-medium">No transactions found</div>
            </div>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>
