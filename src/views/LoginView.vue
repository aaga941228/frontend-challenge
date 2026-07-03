<script setup lang="ts">
import { ref } from 'vue'

const submitting = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const form = ref()

const emailRules = [
  (value: string) => !!value || 'El correo es requerido',
  (value: string) => /.+@.+\..+/.test(value) || 'Correo inválido',
]

const passwordRules = [(value: string) => !!value || 'La contraseña es requerida']

const onSubmitLogin = async () => {
  try {
    submitting.value = true
    const valid = await form.value.validate()

    if (!valid) return
  } catch (error: unknown) {
    console.log('error', error)
  } finally {
    setTimeout(() => {
      submitting.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="login-page flex flex-center items-center">
    <q-card class="login-card q-pa-xl q-mt-xl">
      <div class="text-center q-mb-xl">
        <q-avatar size="72px" color="primary" text-color="white" icon="person" />

        <div class="text-h4 text-weight-bold q-mt-md">Bienvenido</div>

        <div class="text-subtitle1 text-grey-7 q-mt-sm">Inicia sesión para continuar</div>
      </div>

      <q-form ref="form" class="q-gutter-md" @submit.prevent="onSubmitLogin">
        <q-input
          v-model="email"
          :rules="emailRules"
          :disable="submitting"
          type="email"
          class="full-width"
          label="Correo electrónico"
          outlined
          lazy-rules
        >
          <template #prepend>
            <q-icon name="mail" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          :disable="submitting"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          label="Contraseña"
          class="full-width"
          outlined
        >
          <template #prepend>
            <q-icon name="lock" />
          </template>

          <template #append>
            <q-icon
              class="cursor-pointer"
              :name="showPassword ? 'visibility_off' : 'visibility'"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-btn
          :disable="submitting"
          type="submit"
          color="primary"
          label="Iniciar sesión"
          class="full-width q-mt-md"
          unelevated
          no-caps
        />
      </q-form>
    </q-card>
  </div>
</template>

<style>
.login-page {
  min-height: 100dvh;
}
</style>
