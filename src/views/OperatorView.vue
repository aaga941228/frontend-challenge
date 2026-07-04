<template>
  <div class="page-container">
    <q-card flat bordered class="form-card">
      <q-card-section>
        <div class="text-h5 text-weight-bold">Nueva venta</div>
        <div class="text-grey-7">Captura la información para procesar una venta.</div>
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
            label="Importe"
            outlined
            lazy-rules
          />

          <q-input
            v-model="customerName"
            :disable="submitting"
            :rules="customerNameRules"
            label="Nombre del cliente"
            outlined
            lazy-rules
          />

          <q-input
            v-model="cardNumber"
            :disable="submitting"
            :rules="cardNumberRules"
            label="Número de tarjeta"
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
            label="Fecha de expiración"
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
              label="Procesar venta"
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
  (value: string) => !!value || 'Campo requerido',
  (value: string) => Number(value) > 0 || 'Cantiad inválida, solo valores mayores o iguales a 0',
]

const customerNameRules = [(value: string) => !!value || 'Campo requerido']

const cardNumberRules = [
  (value: string) => /^\d{16}$/.test(value.replace(/\s/g, '')) || 'Número de tarjeta inválido',
]

const expirationDateRules = [
  (value: string) => /^(0[1-9]|1[0-2])\/(2[5-9]|[3-9][0-9])$/.test(value) || 'Fecha inválida',
]

const cvvRules = [(value: string) => /^\d{3}$/.test(value) || 'CVV inválido']

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

    form.value.reset()

    showSuccess(
      `Venta realizada exitosamente.
        Número de aprobación: ${approvalNumber}.
        Número de referencia financiera: ${financialReference}
        Número de tarjeta: ${card}
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
