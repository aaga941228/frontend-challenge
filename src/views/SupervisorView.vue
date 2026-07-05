<template>
  <div class="page-container">
    <q-card flat bordered class="form-card">
      <q-card-section>
        <div class="text-h5 text-weight-bold">Manage transaction</div>
        <div class="text-grey-7">Process a cancellation or refund.</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form ref="form" class="q-gutter-md" @submit.prevent="onSubmit">
          <q-select
            v-model="transactionType"
            :options="transactionTypes"
            :rules="transactionTypeRules"
            :disable="submitting"
            label="Transaction type"
            outlined
            emit-value
            map-options
          />

          <q-input
            v-model="financialReference"
            :rules="financialReferenceRules"
            :disable="submitting"
            label="Financial reference"
            mask="########"
            outlined
          />

          <q-input
            v-model="cardNumber"
            :rules="cardNumberRules"
            :disable="submitting"
            label="Card number"
            mask="#### #### #### ####"
            unmasked-value
            fill-mask
            lazy-rules
            outlined
          />

          <div class="row justify-end">
            <q-btn
              color="primary"
              icon="published_with_changes"
              label="Process"
              type="submit"
              :loading="submitting"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import { processTransaction } from '@/services/transactions'
import { encrypt } from '@/utils/cripto'

const { showSuccess, showError } = useNotify()

const form = ref()
const submitting = ref(false)
const transactionType = ref('')
const financialReference = ref('')
const cardNumber = ref('')

const transactionTypes = [
  {
    label: 'Cancellation',
    value: 'cancellation',
  },
  {
    label: 'Devolución',
    value: 'refund',
  },
]

const transactionTypeRules = [(value: string) => !!value || 'Required field']

const financialReferenceRules = [(value: string) => /^\d{8}$/.test(value) || 'Invalid reference']

const cardNumberRules = [(value: string) => /^\d{16}$/.test(value) || 'Invalid card']

const onSubmit = async () => {
  try {
    submitting.value = true

    const valid = await form.value.validate()

    if (!valid) return

    processTransaction({
      financialReference: Number(financialReference.value),
      cardNumber: encrypt(cardNumber.value),
      type: transactionType.value,
    })

    financialReference.value = ''
    cardNumber.value = ''
    transactionType.value = ''

    form.value.reset()

    showSuccess('Transaction processed successfully')
  } catch (error) {
    console.log('errror', error)

    if (typeof error === 'string') {
      showError(error)
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.form-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
}
</style>
