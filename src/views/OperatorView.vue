<script setup lang="ts">
import { ref } from 'vue'
import type { AxiosError } from 'axios'
import { useNotify } from '@/composables/useNotify'
import { sale } from '@/services/transactions'
import { encrypt } from '@/utils/cripto'

const { showSuccess, showError } = useNotify()

const submitting = ref(false)
const amount = ref('')
const customerName = ref('')
const cardNumber = ref('')
const expirationDate = ref('')
const cvv = ref('')
const form = ref()

const amountRules = [
  (value: string) => !!value || 'Required field',
  (value: string) =>
    Number(value) > 0 || 'Invalid quantity; only values ​​greater than or equal to 0.',
]

const customerNameRules = [(value: string) => !!value || 'Required field']

const cardNumberRules = [
  (value: string) => /^\d{16}$/.test(value.replace(/\s/g, '')) || 'Invalid card number',
]

const expirationDateRules = [
  (value: string) => /^(0[1-9]|1[0-2])\/(2[5-9]|[3-9][0-9])$/.test(value) || 'Invalid date',
]

const cvvRules = [(value: string) => /^\d{3}$/.test(value) || 'Invalid CVV']

const onSubmit = async () => {
  try {
    submitting.value = true

    const valid = await form.value.validate()

    if (!valid) return

    const { data } = await sale({
      amount: Number(amount.value),
      name: customerName.value,
      cardNumber: encrypt(cardNumber.value),
      expirationDate: encrypt(expirationDate.value),
      cvv: encrypt(cvv.value),
    })

    const { approvalNumber, financialReference, card } = data

    amount.value = ''
    customerName.value = ''
    cardNumber.value = ''
    expirationDate.value = ''
    cvv.value = ''

    form.value.reset()

    showSuccess(
      `
        Sale successfully completed.
        Approval number: ${approvalNumber}.
        Financial reference number: ${financialReference}
        Card number: ${card}
      `
    )
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data.message ?? 'Unexpected error'

    showError(message)
  } finally {
    submitting.value = false
  }
}
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
            <q-icon name="add_shopping_cart" color="primary" class="q-mr-sm" size="28px" />
            New Sale
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            Capture the information to process a sale.
          </div>
        </q-card-section>

        <q-card-section class="q-px-lg q-pb-lg q-pt-none">
          <q-form ref="form" class="q-gutter-y-sm" @submit.prevent="onSubmit">
            <q-input
              v-model="amount"
              :rules="amountRules"
              :disable="submitting"
              prefix="$"
              type="number"
              label="Amount"
              outlined
              dense
              lazy-rules
            />

            <q-input
              v-model="customerName"
              :disable="submitting"
              :rules="customerNameRules"
              label="Customer name"
              outlined
              dense
              lazy-rules
            />

            <q-input
              v-model="cardNumber"
              :disable="submitting"
              :rules="cardNumberRules"
              label="Card number"
              mask="#### #### #### ####"
              outlined
              dense
              fill-mask
              lazy-rules
            >
              <template #prepend>
                <q-icon name="credit_card" color="grey-5" />
              </template>
            </q-input>

            <div class="row q-col-gutter-x-md">
              <div class="col-7">
                <q-input
                  v-model="expirationDate"
                  :disable="submitting"
                  :rules="expirationDateRules"
                  mask="##/##"
                  placeholder="MM/YY"
                  label="Expiration date"
                  outlined
                  dense
                  fill-mask
                  lazy-rules
                >
                  <template #prepend>
                    <q-icon name="date_range" color="grey-5" />
                  </template>
                </q-input>
              </div>

              <div class="col-5">
                <q-input
                  v-model="cvv"
                  :rules="cvvRules"
                  :disable="submitting"
                  mask="###"
                  label="CVV"
                  type="password"
                  outlined
                  dense
                  fill-mask
                >
                  <template #prepend>
                    <q-icon name="enhanced_encryption" color="grey-5" />
                  </template>
                </q-input>
              </div>
            </div>

            <q-btn
              :disable="submitting"
              color="primary"
              label="Process Sale"
              icon="point_of_sale"
              type="submit"
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
