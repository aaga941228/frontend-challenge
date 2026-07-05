<template>
  <div class="page-container">
    <q-card flat bordered class="form-card">
      <q-card-section>
        <div class="text-h5 text-weight-bold">New sale</div>
        <div class="text-grey-7">Capture the information to process a sale..</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form ref="form" class="q-gutter-md" @submit.prevent="onSubmit">
          <q-input
            v-model="amount"
            :rules="amountRules"
            :disable="submitting"
            prefix="$"
            type="number"
            label="Amount"
            outlined
            lazy-rules
          />

          <q-input
            v-model="customerName"
            :disable="submitting"
            :rules="customerNameRules"
            label="Customer name"
            outlined
            lazy-rules
          />

          <q-input
            v-model="cardNumber"
            :disable="submitting"
            :rules="cardNumberRules"
            label="Card number"
            mask="#### #### #### ####"
            outlined
            fill-mask
            lazy-rules
          />

          <q-input
            v-model="expirationDate"
            :disable="submitting"
            :rules="expirationDateRules"
            mask="##/##"
            placeholder="MM/YY"
            label="Expiration date"
            outlined
            fill-mask
            lazy-rules
          />

          <q-input
            v-model="cvv"
            :rules="cvvRules"
            :disable="submitting"
            mask="###"
            label="CVV"
            type="password"
            outlined
            fill-mask
          />

          <div class="row justify-end">
            <q-btn
              :disable="submitting"
              color="primary"
              label="Process saleF"
              icon="point_of_sale"
              type="submit"
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

    const { approvalNumber, financialReference, card } = await sale({
      amount: Number(amount.value),
      name: customerName.value,
      cardNumber: encrypt(cardNumber.value),
      expirationDate: encrypt(expirationDate.value),
      cvv: encrypt(cvv.value),
    })

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
  padding: 48px;
}

.form-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
}
</style>
