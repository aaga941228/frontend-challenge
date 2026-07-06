<script setup lang="ts">
import { ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import { processTransaction } from '@/services/transactions'
import { encrypt } from '@/utils/cripto'
import type { AxiosError } from 'axios'

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

    await processTransaction({
      financialReference: Number(financialReference.value),
      cardNumber: encrypt(cardNumber.value),
      type: transactionType.value,
    })

    financialReference.value = ''
    cardNumber.value = ''
    transactionType.value = ''

    form.value.reset()

    showSuccess(
      transactionType.value === 'refund'
        ? 'Refund processed successfully'
        : 'Cancellation processed successfully'
    )
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data.message ?? 'Unexpected error'

    showError(message)
  } finally {
    submitting.value = false
  }
}

// 12378891
</script>

<template>
  <q-page padding class="row justify-center items-start">
    <div class="col-12 flex flex-center">
      <q-card
        flat
        bordered
        class="form-card bg-white shadow-1"
        style="width: 100%; max-width: 440px; border-radius: 12px"
      >
        <q-card-section class="q-pa-lg">
          <div class="text-h5 text-weight-bold text-grey-9 row items-center no-wrap">
            <q-icon name="published_with_changes" color="primary" class="q-mr-sm" size="28px" />
            Manage Transaction
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">Process a cancellation or refund.</div>
        </q-card-section>

        <q-card-section class="q-px-lg q-pb-lg q-pt-none">
          <q-form ref="form" class="q-gutter-y-sm" @submit.prevent="onSubmit">
            <q-select
              v-model="transactionType"
              :options="transactionTypes"
              :rules="transactionTypeRules"
              :disable="submitting"
              label="Transaction type"
              outlined
              dense
              emit-value
              map-options
            >
              <template #prepend>
                <q-icon name="swap_horiz" color="grey-5" />
              </template>
            </q-select>

            <q-input
              v-model="financialReference"
              :rules="financialReferenceRules"
              :disable="submitting"
              label="Financial reference"
              mask="########"
              outlined
              dense
            >
              <template #prepend>
                <q-icon name="tag" color="grey-5" />
              </template>
            </q-input>

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
              dense
            >
              <template #prepend>
                <q-icon name="credit_card" color="grey-5" />
              </template>
            </q-input>

            <q-btn
              color="primary"
              icon="published_with_changes"
              label="Process Transaction"
              type="submit"
              :loading="submitting"
              class="full-width q-mt-md q-py-sm text-weight-bold"
              unelevated
              no-caps
              style="border-radius: 8px"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>
.form-card {
  transition: all 0.3s ease;
}
</style>
