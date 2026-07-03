<template>
  <div class="page-container">
    <q-card flat bordered class="form-card">
      <q-card-section>
        <div class="text-h5 text-weight-bold">Administrar transacción</div>
        <div class="text-grey-7">Procesa una cancelación o devolución.</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form ref="form" class="q-gutter-md" @submit.prevent="onSubmit">
          <q-select
            v-model="transactionType"
            :options="transactionTypes"
            :rules="transactionTypeRules"
            :disable="submitting"
            label="Tipo de transacción"
            outlined
            emit-value
            map-options
          />

          <q-input
            v-model="financialReference"
            :rules="financialReferenceRules"
            :disable="submitting"
            label="Referencia financiera"
            mask="########"
            outlined
          />

          <q-input
            v-model="cardNumber"
            :rules="cardNumberRules"
            :disable="submitting"
            label="Número de tarjeta"
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
              label="Procesar"
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

const { showSuccess, showError } = useNotify()

const form = ref()
const submitting = ref(false)
const transactionType = ref('')
const financialReference = ref('')
const cardNumber = ref('')

const transactionTypes = [
  {
    label: 'Cancelación',
    value: 'cancellation',
  },
  {
    label: 'Devolución',
    value: 'refund',
  },
]

const transactionTypeRules = [(value: string) => !!value || 'Campo requerido']

const financialReferenceRules = [(value: string) => /^\d{8}$/.test(value) || 'Referencia inválida']

const cardNumberRules = [(value: string) => /^\d{16}$/.test(value) || 'Tarjeta inválida']

const onSubmit = async () => {
  try {
    submitting.value = true

    const valid = await form.value.validate()

    if (!valid) return

    showSuccess('Venta realizada exitosamente')

    form.value.reset()
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
