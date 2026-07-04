<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { getTransactions } from '@services/transactions'
import { useNotify } from '@composables/useNotify'

const { showError } = useNotify()

const loading = ref(false)
const rows = ref([])

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
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    align: 'right',
    sortable: true,
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
        :rows="rows"
        :q-pagination="pagination"
        :columns="columns"
        row-key="financialReference"
        :loading="loading"
        flat
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip :color="getStatusColor(props.value)" text-color="white" dense>
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width row justify-center q-pa-lg text-grey">No transactions found</div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>
