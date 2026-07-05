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

    rows.value = await getTransactions()
  } catch {
    showError('Error al obtener las transacciones')
  } finally {
    loading.value = false
  }
}

onMounted(loadTransactions)
</script>

<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Transactions</div>
      </q-card-section>

      <q-separator />

      <q-table
        v-model:pagination="pagination"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        row-key="financialReference"
        flat
      >
        <template #body-cell-amount="props">
          <q-td :props="props">
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
            <q-chip :color="getStatusColor(props.value)" text-color="white" dense>
              {{ getStatusLabel(props.value) }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-createdAt="props">
          <q-td :props="props">
            {{ formatDate(props.value) }}
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width row justify-center q-pa-lg text-grey">No transactions found</div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>
